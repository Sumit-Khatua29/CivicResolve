import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Bar } from 'react-chartjs-2';
import { motion } from "framer-motion";
import { FaChartBar, FaMapMarkedAlt } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from "../../services/api";
import "./AnalyticsDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Initial center (India) - will be overridden by MapBounds if data exists
const defaultCenter = [20.5937, 78.9629];

// Component to handle dynamic map centering
const MapBounds = ({ points }) => {
    const map = useMap();

    useEffect(() => {
        if (points.length > 0) {
            // Leaflet heatmap points are [lat, lng, intensity]
            const bounds = L.latLngBounds(points.map(p => [p[0], p[1]]));
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [points, map]);

    return null;
};

const AnalyticsDashboard = () => {
    const [categoryData, setCategoryData] = useState({
        labels: [],
        datasets: []
    });
    const [heatmapData, setHeatmapData] = useState([]);

    useEffect(() => {
        fetchCategoryData();
        fetchLocationData();
    }, []);

    const fetchCategoryData = async () => {
        try {
            const response = await api.get("/analytics/categories");
            const data = response.data;
            setCategoryData({
                labels: data.map(item => item.category),
                datasets: [
                    {
                        label: 'Issues by Category',
                        data: data.map(item => item.count),
                        backgroundColor: 'rgba(67, 97, 238, 0.7)',
                        borderColor: 'rgba(67, 97, 238, 1)',
                        borderWidth: 1,
                        borderRadius: 8,
                        hoverBackgroundColor: 'rgba(67, 97, 238, 0.9)',
                    }
                ]
            });
        } catch (error) {
            console.error("Error fetching category data", error);
        }
    };

    const fetchLocationData = async () => {
        try {
            const response = await api.get("/analytics/locations");
            // Map to [lat, lng, intensity] format for react-leaflet-heatmap-layer-v3
            const data = response.data
                .filter(loc => loc.latitude && loc.longitude)
                .map(loc => [parseFloat(loc.latitude), parseFloat(loc.longitude), loc.weight || 1]);
            
            setHeatmapData(data);
        } catch (error) {
            console.error("Error fetching location data", error);
        }
    };

    return (
        <div className="mt-2">
            <div className="d-flex align-items-center mb-4">
               <div>
                 <h4 className="mb-0 fw-bold">Analytics Overview</h4>
                 <small className="text-muted">Real-time data insights</small>
               </div>
            </div>

            <Row className="g-4"> 
                <Col lg={6} className="mb-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-100"
                    >
                        <Card className="analytics-card-modern border-0 h-100">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="icon-wrapper-modern blue me-3 shadow-sm">
                                        <FaChartBar size={22} />
                                    </div>
                                    <h5 className="mb-0 card-title analytics-card-title">Issues by Category</h5>
                                </div>
                                <div className="analytics-chart-container">
                                    <Bar 
                                        options={{ 
                                            responsive: true, 
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { display: false },
                                                tooltip: {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    titleColor: '#1e293b',
                                                    bodyColor: '#475569',
                                                    borderColor: 'rgba(226, 232, 240, 1)',
                                                    borderWidth: 1,
                                                    padding: 12,
                                                    displayColors: false,
                                                    callbacks: {
                                                        label: function(context) {
                                                            return context.parsed.y + ' Issues';
                                                        }
                                                    }
                                                }
                                            },
                                            scales: {
                                                y: { 
                                                    grid: { display: true, borderDash: [4, 4], color: '#f1f5f9' }, 
                                                    beginAtZero: true,
                                                    ticks: { font: { family: "'Inter', sans-serif", size: 12 }, color: '#94a3b8' }
                                                },
                                                x: { 
                                                    grid: { display: false },
                                                    ticks: { font: { family: "'Inter', sans-serif", size: 12 }, color: '#64748b' }
                                                } 
                                            }
                                        }} 
                                        data={categoryData} 
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
                <Col lg={6} className="mb-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                         className="h-100"
                    >
                        <Card className="analytics-card-modern border-0 h-100 p-0">
                             <div className="p-4 d-flex align-items-center border-bottom border-light">
                                    <div className="icon-wrapper-modern green me-3 shadow-sm">
                                        <FaMapMarkedAlt size={22} />
                                    </div>
                                    <h5 className="mb-0 card-title analytics-card-title">Geographic Heatmap</h5>
                             </div>
                            <Card.Body className="p-0 position-relative analytics-map-card-body">
                                <div className="w-100 h-100 map-view-container">
                                    <MapContainer center={defaultCenter} zoom={5} className="analytics-map-container" scrollWheelZoom={false}>
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <MapBounds points={heatmapData} />
                                        {heatmapData.length > 0 && (
                                            <HeatmapLayer
                                                fitBoundsOnLoad
                                                fitBoundsOnUpdate
                                                points={heatmapData}
                                                longitudeExtractor={m => m[1]}
                                                latitudeExtractor={m => m[0]}
                                                intensityExtractor={m => parseFloat(m[2])}
                                                radius={30}
                                                max={5} 
                                                minOpacity={0.4}
                                                gradient={{0.4: 'blue', 0.65: 'lime', 1: 'red'}}
                                            />
                                        )}
                                    </MapContainer>
                                </div>
                            </Card.Body>
                        </Card>
                    </motion.div>
                </Col>
            </Row>
        </div>
    );
};

export default AnalyticsDashboard;
