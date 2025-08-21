import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./login.css";

function Login() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    // Prevent the default form submission behavior
    e.preventDefault(); 

    if (!rollNo || !password) {
      return alert("Please enter both Roll No. and password");
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { username: rollNo, password });
      localStorage.setItem("token", res.data.token);

      const decodedToken = jwtDecode(res.data.token);
      const userRole = decodedToken.role;

      alert("✅ Login successful! Redirecting...");

      if (userRole === "admin") {
        navigate("/helpdesk");
      } else if (userRole === "student") {
        navigate("/publicview");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "❌ Login failed, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-card">
        <h2>🔑 Login</h2>
        <form onSubmit={handleLogin}> {/* Wrap the form content */}
          <div className="login-input-group">
            <input
              type="text"
              placeholder="Roll No."
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="login-input"
            />
          </div>
          <div className="login-input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>
          <button
            type="submit" // Change button type to 'submit'
            disabled={loading}
            className="login-button"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;