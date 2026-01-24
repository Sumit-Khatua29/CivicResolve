import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Navbar,
  Container,
  Nav,
  Button,
  Badge,
  Dropdown,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import {
  FaCity,
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import "./NavBar.css";

const NavBar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (currentUser?.role === "ROLE_ADMIN") {
      return "/admin";
    } else if (currentUser?.role === "ROLE_CONTRACTOR") {
      return "/contractor";
    }
    return "/citizen";
  };

  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const [expanded, setExpanded] = React.useState(false);

  return (
    <Navbar
      expanded={expanded}
      onToggle={setExpanded}
      expand="lg"
      className={`navbar-custom py-2 fixed-top transition-all ${scrolled ? "shadow-sm navbar-scrolled" : "navbar-transparent"}`}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className={`d-flex align-items-center fw-bold fs-4 navbar-brand-custom ${scrolled ? "text-primary" : "text-white"}`}
          onClick={() => setExpanded(false)}
        >
          <FaCity
            className={`me-2 ${scrolled ? "text-primary" : "text-info"}`}
            size={28}
          />
          Civic
          <span
            className={
              scrolled ? "brand-text-scrolled" : "brand-text-transparent"
            }
          >
            Resolve
          </span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="border-0 shadow-none bg-light opacity-75"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {["Home", "Dashboard", "About", "Contact"].map((item, index) => {
              const linkPath =
                item === "Home"
                  ? "/"
                  : item === "Dashboard"
                    ? getDashboardLink()
                    : `/${item.toLowerCase()}`;
              if (item === "Dashboard" && !currentUser) return null;
              if (item === "Home" && currentUser?.role === "ROLE_CONTRACTOR")
                return null;

              return (
                <Nav.Link
                  key={index}
                  as={Link}
                  to={linkPath}
                  className={`fw-bold mx-2 hover-scale nav-link-custom ${scrolled ? "text-dark" : "text-light opacity-75 hover-opacity-100"}`}
                  onClick={() => setExpanded(false)}
                >
                  {item}
                </Nav.Link>
              );
            })}
          </Nav>
          <Nav className="align-items-center">
            {currentUser ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="transparent"
                  id="dropdown-basic"
                  className={`d-flex align-items-center rounded-pill px-3 border ${scrolled ? "border-secondary text-dark" : "border-secondary text-white"}`}
                >
                  <FaUserCircle
                    className={`me-2 ${scrolled ? "text-primary" : "text-info"}`}
                    size={20}
                  />
                  <span className="fw-semibold">{currentUser.username}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="border-0 shadow-lg rounded-4 mt-2 p-2"
                  align="end"
                >
                  <Dropdown.Item
                    as={Link}
                    to={getDashboardLink()}
                    className="rounded-3 px-3 py-2"
                    onClick={() => setExpanded(false)}
                  >
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/profile"
                    className="rounded-3 px-3 py-2"
                    onClick={() => setExpanded(false)}
                  >
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={() => {
                      handleLogout();
                      setExpanded(false);
                    }}
                    className="text-danger rounded-3 px-3 py-2"
                  >
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex gap-3">
                {location.pathname !== "/register" && (
                  <Link to="/register" onClick={() => setExpanded(false)}>
                    <Button className="rounded-pill px-4 py-2 fw-bold d-flex align-items-center shadow-lg hover-lift border-0 btn-register-custom">
                      <FaUserPlus className="me-2" />
                      Register
                    </Button>
                  </Link>
                )}
                {location.pathname === "/register" && (
                  <Link to="/login" onClick={() => setExpanded(false)}>
                    <Button className="rounded-pill px-4 py-2 fw-bold d-flex align-items-center shadow-lg hover-lift border-0 btn-login-custom">
                      <FaSignInAlt className="me-2" />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
