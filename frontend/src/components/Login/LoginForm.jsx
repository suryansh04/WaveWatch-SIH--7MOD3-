// import React, { useState } from "react";
// import { Mail, Lock, AlertCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./LoginForm.css";

// const LoginForm = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // Replace with your actual backend URL
//       const response = await axios.post("http://localhost:3000/auth/login", {
//         email,
//         password,
//       });

//       // Store the token in localStorage
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("user", JSON.stringify(response.data.user));

//       // Set authorization header for future requests
//       axios.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${response.data.token}`;

//       console.log("Login successful:", response.data);

//       // Redirect based on user role
//       if (response.data.user.role === "admin") {
//         navigate("/dashboard");
//       } else if (response.data.user.role === "analyst") {
//         navigate("/analyst-dashboard");
//       }
//     } catch (err) {
//       console.error("Login error:", err);

//       if (err.response?.data?.msg) {
//         setError(err.response.data.msg);
//       } else if (err.response?.data?.errors) {
//         setError(err.response.data.errors[0].msg);
//       } else {
//         setError("Login failed. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-form">
//         <div className="login-logo-container">
//           <div className="login-logo">
//             <img src="../src/assets/logo.png" alt="Logo" />
//           </div>
//         </div>
//         <div className="login-heading">
//           <h2 className="login-title">Admin Panel Login</h2>
//           <p className="login-description">
//             Admins: Use credentials provided by INCOIS.
//           </p>
//         </div>

//         {error && (
//           <div className="login-error">
//             <AlertCircle className="login-error-icon" size={16} />
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="login-form-element">
//           <div className="login-input-group">
//             <label htmlFor="email" className="login-label">
//               <Mail className="login-icon" size={16} />
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               className="login-input"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               required
//               disabled={loading}
//             />
//           </div>

//           <div className="login-input-group">
//             <label htmlFor="password" className="login-label">
//               <Lock className="login-icon" size={16} />
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               className="login-input"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               required
//               disabled={loading}
//             />
//           </div>

//           <button type="submit" className="login-button" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <div className="login-footer">
//           <span className="login-footer-text">Don't have an account?</span>
//           <a href="/signup" className="login-link">
//             Signup
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;

//-------------------------------------------------------------- NEW CODE ------------------------------------------------------------------

import React, { useState } from "react";
import { Mail, Lock, AlertCircle, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // NEW: Role state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Replace with your actual backend URL
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      // NEW: Check if the logged-in user's role matches the selected role
      if (response.data.user.role !== role) {
        throw new Error(
          `Invalid credentials. Please select the correct role (${response.data.user.role}).`
        );
      }

      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Set authorization header for future requests
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      console.log("Login successful:", response.data);

      // NEW: Redirect based on user role with approval check for analyst
      if (response.data.user.role === "admin") {
        navigate("/dashboard");
      } else if (response.data.user.role === "analyst") {
        // Check if analyst is approved
        if (response.data.user.status === "approved") {
          navigate("/analyst-dashboard");
        } else {
          throw new Error("Your account is pending admin approval.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);

      // Handle custom error message from role mismatch
      if (err.message && !err.response) {
        setError(err.message);
      } else if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-logo-container">
          <div className="login-logo">
            <img src="../src/assets/logo.png" alt="Logo" />
          </div>
        </div>
        <div className="login-heading">
          <h2 className="login-title">Admin Panel Login</h2>
          <p className="login-description">
            Admins: Use credentials provided by INCOIS.
          </p>
        </div>

        {error && (
          <div className="login-error">
            <AlertCircle className="login-error-icon" size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form-element">
          {/* NEW: Role Dropdown */}
          <div className="login-input-group">
            <label htmlFor="role" className="login-label">
              <UserCircle className="login-icon" size={16} />
              Login As
            </label>
            <select
              id="role"
              className="login-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              disabled={loading}
            >
              <option value="admin">Admin</option>
              <option value="analyst">Analyst</option>
            </select>
          </div>

          <div className="login-input-group">
            <label htmlFor="email" className="login-label">
              <Mail className="login-icon" size={16} />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="login-input-group">
            <label htmlFor="password" className="login-label">
              <Lock className="login-icon" size={16} />
              Password
            </label>
            <input
              type="password"
              id="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <span className="login-footer-text">Don't have an account?</span>
          <a href="/signup" className="login-link">
            Signup
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
