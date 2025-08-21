import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./registration.css"; // Make sure this file exists

function Registration() {
  const [username, setUsername] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !studentId || !password) {
      return alert("Please enter username, student ID, and password");
    }

    setLoading(true);
    try {
      await API.post("/auth/register", { username, studentId, password });

      alert("✅ Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Registration failed, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2>✍️ Register New User</h2>

        <div className="registration-input-group">
          <input
            className="registration-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="registration-input-group">
          <input
            className="registration-input"
            type="text"
            placeholder="Student ID (Roll No.)"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </div>

        <div className="registration-input-group">
          <input
            className="registration-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="registration-button"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}

export default Registration;
