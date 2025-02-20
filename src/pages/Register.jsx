import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Loader from "../components/Layout/Loader";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const { name, email, password } = formData;
    
    if (!name || !email || !password) {
      setError("All fields are required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
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

  const handleRegistration = async () => {
    try {
      const { data } = await api.post("/api/auth/register", {
        ...formData,
        email: formData.email.toLowerCase()
      });

      localStorage.setItem("token", data.token);
      login(data.user, data.token);
      navigate("/dashboard", { state: { newUser: true } });
    } catch (err) {
      const errorMessage = err.response?.data?.message 
        || "Registration failed. Please try again.";
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
      await handleRegistration();
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join our community today</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div role="alert" className="auth-alert error">
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
              className="form-input"
              autoComplete="name"
              aria-describedby="nameHelp"
            />
          </div>

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
              autoComplete="new-password"
              minLength="6"
            />
            <small id="passwordHelp" className="input-hint">
              Minimum 6 characters
            </small>
          </div>

          <button 
            type="submit" 
            className="primary-button"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? <Loader size="small" /> : "Create Account"}
          </button>
        </form>

        <footer className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Log in here
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Register;