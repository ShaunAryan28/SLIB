import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode
import "./login.css"; // Import the new CSS file

function Login() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!rollNo || !password) {
      return alert("Please enter both Roll No. and password");
    }

    //console.log("Frontend Login Request:", { rollNo, password }); // Add this line

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { username: rollNo, password });

      localStorage.setItem("token", res.data.token);

      const decodedToken = jwtDecode(res.data.token);
      const userRole = decodedToken.role;
      //console.log("Detected user role:", userRole); // Add this log

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
          onClick={handleLogin}
          disabled={loading}
          className="login-button"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
