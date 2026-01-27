import React, { useState, useEffect, useCallback } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import IssueService from "../../services/issue.service";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { motion } from "framer-motion";
import "./ReportIssue.css";

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const ReportIssue = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [category, setCategory] = useState("POTHOLE");
  const [otherCategory, setOtherCategory] = useState("");
  const [image, setImage] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(true);
  const [pincodeVerified, setPincodeVerified] = useState(false);

  // Map State
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [center, setCenter] = useState(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setLatitude(lat);
    setLongitude(lng);
    setMarkerPosition({ lat, lng });
    setShowInfoWindow(true);
    // Optional: Reverse geocode here if using Google Geocoding API (requires setup)
  }, []);

  useEffect(() => {
    if (isEditMode) {
      fetchIssueDetails();
    } else {
      detectLocation();
    }
  }, [id, isEditMode]);

  const detectLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
          setMarkerPosition(pos);
          setLatitude(pos.lat);
          setLongitude(pos.lng);
          setShowInfoWindow(true);
          setIsLocating(false);

          if (map) {
            map.panTo(pos);
            map.setZoom(15);
          }
        },
        (err) => {
          console.error("Error: ", err);
          let errorMsg = "Location error.";
          if (err.code === 1)
            errorMsg = "Permission denied. Allow location access.";
          else if (err.code === 2) errorMsg = "Position unavailable.";
          else if (err.code === 3) errorMsg = "Timeout.";
          setError(
            errorMsg + " using default location. Please adjust manually.",
          );

          // Fallback to default location
          setCenter(defaultCenter);
          setMarkerPosition(defaultCenter);
          setLatitude(defaultCenter.lat);
          setLongitude(defaultCenter.lng);

          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const fetchIssueDetails = async () => {
    try {
      setLoading(true);
      const response = await IssueService.getIssueById(id);
      const issue = response.data;
      setDescription(issue.description);
      setAddress(issue.address || "");
      setPincode(issue.pincode || "");
      if (issue.pincode) setPincodeVerified(true);
      setCategory(issue.category);
      if (issue.category === "OTHER") {
        setOtherCategory(issue.otherCategory || "");
      }
      const lat = parseFloat(issue.latitude);
      const lng = parseFloat(issue.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        const pos = { lat, lng };
        setLatitude(lat);
        setLongitude(lng);
        setMarkerPosition(pos);
        setCenter(pos);
      }
    } catch (err) {
      setError("Failed to load issue details.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Please upload a JPEG or PNG image.");
        setImage(null);
        e.target.value = null; // Reset input
        return;
      }
      // Validate file size (e.g., 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File is too large. Maximum size is 5MB.");
        setImage(null);
        e.target.value = null; // Reset input
        return;
      }
      setError(""); // Clear error if valid
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // --- Validation ---
    if (!description || description.trim().length < 10) {
      setError("Description must be at least 10 characters long.");
      return;
    }

    if (!address || address.trim().length === 0) {
      setError("Address is required.");
      return;
    }

    if (address.length > 500) {
      setError("Address must be less than 500 characters.");
      return;
    }

    if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode)) {
      setError("Please enter a valid 6-digit Pincode (cannot start with 0).");
      return;
    }

    if (!pincodeVerified) {
        setError("Pincode is not verified. Please check the pincode and wait for validation success.");
        return;
    }

    if (!latitude || !longitude) {
      setError("Location is required. Please select a location on the map.");
      return;
    }

    if (category === "OTHER" && !otherCategory.trim()) {
      setError("Please specify the category.");
      return;
    }
    // ------------------

    const formData = new FormData();
    formData.append("description", description);
    formData.append("address", address);
    formData.append("pincode", pincode);
    formData.append("category", category);
    if (category === "OTHER") {
      formData.append("otherCategory", otherCategory);
    }
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    if (image) {
      formData.append("image", image);
    }

    try {
      if (isEditMode) {
        await IssueService.updateIssue(id, formData);
        setSuccess("Issue updated successfully!");
      } else {
        await IssueService.createIssue(formData);
        setSuccess("Issue reported successfully!");
      }
      setTimeout(() => navigate("/citizen"), 2000);
    } catch (err) {
      console.error("Submission error:", err);
      const status = err.response ? err.response.status : "Unknown";
      const msg =
        err.response?.data?.message ||
        err.message ||
        JSON.stringify(err.response?.data);
      setError(
        `Failed to ${isEditMode ? "update" : "report"} issue (Status: ${status}). Details: ${msg}`,
      );
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="report-issue-container">
        <div className="glass-card p-4 p-md-5">
          <h2 className="mb-4">
            {isEditMode ? "Edit Issue" : "Report an Issue"}
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => {
                  if (description.trim().length > 0 && description.trim().length < 10) {
                     setError("Description must be at least 10 characters long.");
                  } else {
                     if (error.includes("Description")) setError("");
                  }
                }}
                required
                placeholder="Describe the issue clearly (min 10 chars)..."
              />
              {error && error.includes("Description") && (
                <div className="text-danger mt-1">
                  <small>{error}</small>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address *</Form.Label>
              <Form.Control
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={() => {
                   if (!address.trim()) {
                      setError("Address is required.");
                   } else {
                      if (error.includes("Address")) setError("");
                   }
                }}
                required
                maxLength={500}
                placeholder="Enter location address"
              />
              {error && error.includes("Address") && (
                <div className="text-danger mt-1">
                  <small>{error}</small>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Area Code / Pincode *</Form.Label>
              <Form.Control
                type="text"
                value={pincode}
                onChange={(e) => {
                  const val = e.target.value;
                  // Allow only digits, no spaces, max 6 chars
                  if (/^\d*$/.test(val) && val.length <= 6) {
                    setPincode(val);
                    setPincodeVerified(false); // Reset verification on change
                    // Clear API error if user is typing
                    if (error.includes("Pincode")) setError("");
                  }
                }}
                onBlur={async () => {
                   if (pincode.length === 6) {
                       if (pincode.startsWith('0')) {
                           setError("Pincode cannot start with 0.");
                           return;
                       }
                       // API Validation
                       try {
                           const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                           const data = await res.json();
                           if (data && data[0] && data[0].Status === "Success") {
                               setSuccess("Pincode verified via API.");
                               setPincodeVerified(true);
                               setTimeout(() => setSuccess(""), 3000);
                           } else {
                               setError("Invalid Pincode (not found in database).");
                               setPincodeVerified(false);
                           }
                       } catch (err) {
                           console.error("Pincode API Error", err);
                           // If API is down, maybe allow?
                           // For now, let's be strict or user can't submit 111111
                           setError("Could not verify pincode. Please try again."); 
                           setPincodeVerified(false);
                       }
                   } else if (pincode.length > 0) {
                      setError("Pincode must be exactly 6 digits.");
                   }
                }}
                required
                placeholder="Enter 6-digit Pincode"
              />
              {error && (error.includes("Pincode") || error.includes("verified")) && (
                <div className="text-danger mt-1">
                  <small>{error}</small>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="POTHOLE">Potholes / Roads</option>
                <option value="GARBAGE">Garbage</option>
                <option value="WATER_LEAKAGE">Water Leakage</option>
                <option value="STREET_LIGHT">Street Light</option>
                <option value="ILLEGAL_PARKING">Illegal Parking</option>
                <option value="NOISE_COMPLAINT">Noise Complaint</option>
                <option value="GRAFFITI">Graffiti</option>
                <option value="DEAD_ANIMAL">Dead Animal</option>
                <option value="BROKEN_SIDEWALK">Broken Sidewalk</option>
                <option value="OTHER">Other</option>
              </Form.Select>
            </Form.Group>

            {category === "OTHER" && (
              <Form.Group className="mb-3">
                <Form.Label>Specify Category</Form.Label>
                <Form.Control
                  type="text"
                  value={otherCategory}
                  onChange={(e) => setOtherCategory(e.target.value)}
                  onBlur={() => {
                      if (!otherCategory.trim()) {
                          setError("Please specify the category.");
                      } else {
                          if (error.includes("category")) setError("");
                      }
                  }}
                  required
                  placeholder="Enter category name"
                />
                {error && error.includes("category") && (
                  <div className="text-danger mt-1">
                    <small>{error}</small>
                  </div>
                )}
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>
                {isEditMode ? "Upload New Image (Optional)" : "Upload Image"}
              </Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
                required={!isEditMode} // Required only for new issues
                accept="image/png, image/jpeg, image/jpg"
              />
              <Form.Text className="text-muted">
                Max 5MB. Formats: JPG, PNG.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0">
                  Location (Click on map to adjust)
                </Form.Label>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={detectLocation}
                  disabled={isLocating}
                >
                  {isLocating ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      Locating...
                    </>
                  ) : (
                    "📍 Use My Current Location"
                  )}
                </Button>
              </div>
              <div className="report-map-wrapper">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerClassName="google-map-container"
                    center={center}
                    zoom={15}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onClick={onMapClick}
                  >
                    {markerPosition && (
                      <MarkerF
                        position={markerPosition}
                        onClick={() => setShowInfoWindow(!showInfoWindow)}
                      >
                        {showInfoWindow && (
                          <InfoWindowF
                            position={markerPosition}
                            onCloseClick={() => setShowInfoWindow(false)}
                          >
                            <div className="info-window-content">
                              <small>{address || "Selected Location"}</small>
                            </div>
                          </InfoWindowF>
                        )}
                      </MarkerF>
                    )}
                  </GoogleMap>
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <Spinner animation="border" />
                  </div>
                )}
              </div>
              <Form.Text className="text-muted report-loc-text">
                Selected Coordinates: {latitude || "-"}, {longitude || "-"}
              </Form.Text>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="btn-primary-custom w-100"
            >
              {isEditMode ? "Update Issue" : "Submit Report"}
            </Button>
          </Form>
        </div>
      </Container>
    </motion.div>
  );
};

export default ReportIssue;
