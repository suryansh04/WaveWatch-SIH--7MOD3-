import React, { useState } from "react";
import axios from "axios";
import { User, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./SignupForm.css";

const SignupForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Replace with your actual backend URL
      const response = await axios.post("http://localhost:3000/auth/signup", {
        name,
        email,
        password,
      });

      console.log("Signup successful:", response.data);
      setSuccess(true);

      // Clear form
      setName("");
      setEmail("");
      setPassword("");

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Signup error:", err);

      if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        setError(err.response.data.errors[0].msg);
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="signup-logo-container">
          <div className="signup-logo">
            <img src="../src/assets/logo.png" alt="Logo" />
          </div>
        </div>

        <div className="signup-header">
          <h2 className="signup-title">Admin Panel Signup</h2>
          <p className="signup-subtitle">
            Analysts: Sign up for access (requires Admin approval)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form-element">
          <div className="signup-input-group">
            <label htmlFor="name" className="signup-label">
              <User className="signup-icon" size={16} />
              Name
            </label>
            <input
              type="text"
              id="name"
              className="signup-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="signup-input-group">
            <label htmlFor="email" className="signup-label">
              <Mail className="signup-icon" size={16} />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="signup-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="signup-input-group">
            <label htmlFor="password" className="signup-label">
              <Lock className="signup-icon" size={16} />
              Password
            </label>
            <input
              type="password"
              id="password"
              className="signup-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="signup-button">
            Signup
          </button>
        </form>

        <div className="signup-footer">
          <span className="signup-footer-text">Already have an account?</span>
          <a href="/login" className="signup-link">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
