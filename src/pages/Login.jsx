import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Loader from "../components/Layout/Loader";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const { email, password } = formData;

    if (!email || !password) {
      setError("All fields are required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  const handleAuthentication = async () => {
    try {
      const { data } = await api.post("/api/auth/login", {
        email: formData.email.toLowerCase(),
        password: formData.password
      });

      // Server should set HTTP-only cookie
      login(data.user);
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.status === 401 
        ? "Invalid credentials" 
        : err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await handleAuthentication();
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div role="alert" className="auth-alert error">
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className="form-input"
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              className="form-input"
              autoComplete="current-password"
            />
            <div className="auth-footer-links">
              <Link to="/forgot-password" className="auth-link">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button 
            type="submit" 
            className="primary-button"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? <Loader size="small" /> : "Sign In"}
          </button>
        </form>

        <footer className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Register here
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Login;