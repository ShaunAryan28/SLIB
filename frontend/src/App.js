import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { jwtDecode } from "jwt-decode"; // Import jwtDecode to decode the token
import "./App.css"; // Import the new App.css file
import PublicView from "./pages/publicview";
import HelpDesk from "./pages/helpdesk";
import Login from "./pages/login";
import Registration from "./pages/registration";

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    //console.log("Checking login status. Token found:", !!token); // Log if token exists
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        //console.log("Decoded token role:", decodedToken.role); // Log decoded role
        if (decodedToken.role === "admin") {
          setIsAdminLoggedIn(true);
          setIsStudentLoggedIn(false);
        } else if (decodedToken.role === "student") {
          setIsStudentLoggedIn(true);
          setIsAdminLoggedIn(false);
        } else {
          setIsAdminLoggedIn(false);
          setIsStudentLoggedIn(false);
        }
      } catch (error) {
        console.error("Error decoding token or token invalid:", error);
        localStorage.removeItem("token");
        setIsAdminLoggedIn(false);
        setIsStudentLoggedIn(false);
      }
    } else {
      setIsAdminLoggedIn(false);
      setIsStudentLoggedIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAdminLoggedIn(false);
    setIsStudentLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    checkLoginStatus(); // Check status on mount and on location change
    // Add event listener for storage changes (e.g., logout from another tab)
    window.addEventListener("storage", checkLoginStatus);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [location.pathname]); // Re-run effect when pathname changes

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Only redirect if there's no token AND we're not already on allowed unauthenticated pages
    if (!token && location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/") {
      navigate("/login");
    }
  }, [navigate, location.pathname, isAdminLoggedIn, isStudentLoggedIn]); // Re-run if login status or path changes

  return (
    <div>
      <div style={{ padding: "20px" }}>
        {/* 🔹 Simple Navigation */}
        <nav className="navbar" style={{ marginBottom: "20px" }}>
          <Link to="/" className="navbar-link navbar-spacing">Public View</Link>
          {isAdminLoggedIn && (
            <Link to="/helpdesk" className="navbar-link navbar-spacing">Help Desk</Link>
          )}
          {!isAdminLoggedIn && !isStudentLoggedIn && (
            <Link to="/login" className="navbar-link navbar-spacing">Admin Login</Link>
          )}
          {!isAdminLoggedIn && !isStudentLoggedIn && (
            <Link to="/register" className="navbar-link navbar-spacing">Register</Link>
          )}
          {isAdminLoggedIn && (
            <button onClick={handleLogout} className="navbar-button">Logout</button>
          )}
        </nav>

        {/* 🔹 Define Routes */}
        <Routes>
          <Route path="/" element={<PublicView />} />
          <Route path="/helpdesk" element={<HelpDesk />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
