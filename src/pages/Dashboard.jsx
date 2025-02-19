import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Layout/Loader";
import api from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [attempts, setAttempts] = useState([]);
  const [availableExams, setAvailableExams] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const controller = new AbortController();
    
    const loadDashboardData = async () => {
      try {
        const [attemptsResponse, examsResponse] = await Promise.all([
          api.get("/api/attempts", { signal: controller.signal }),
          api.get("/api/exams", { signal: controller.signal })
        ]);

        setAttempts(attemptsResponse.data);
        setAvailableExams(examsResponse.data);

        if (examsResponse.data.length > 0) {
          const currentYear = new Date().getFullYear();
          const defaultExam = examsResponse.data.find(e => e.year === currentYear) 
            || examsResponse.data[0];
          
          setSelectedYear(defaultExam.year);
          setSelectedShift(defaultExam.shift);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.response?.data?.message || "Failed to load dashboard data");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    if (user) loadDashboardData();
    return () => controller.abort();
  }, [user]);

  const handleStartExam = async (e) => {
    e.preventDefault();
    setError(null);
    setIsStarting(true);

    try {
      const { data } = await api.post("/api/attempts", {
        userId: user._id,
        examYear: selectedYear,
        examShift: selectedShift
      });

      navigate(`/exam/${data.attemptId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start exam");
    } finally {
      setIsStarting(false);
    }
  };

  if (!user) return null;
  if (isLoading) return <Loader fullPage />;
  
  const uniqueYears = [...new Set(availableExams.map(e => e.year))].sort((a, b) => b - a);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome back, {user.name}</h1>
        <div className="user-meta">
          <span className="badge">Total Attempts: {attempts.length}</span>
          <span className="badge">Available Exams: {availableExams.length}</span>
        </div>
      </header>

      {error && (
        <div className="dashboard-alert error" role="alert">
          {error}
        </div>
      )}

      <section className="exam-selector">
        <h2>Start New Attempt</h2>
        
        <form onSubmit={handleStartExam}>
          <div className="form-group">
            <label htmlFor="year-select">Select Year</label>
            <select 
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={isStarting}
            >
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="shift-select">Select Shift</label>
            <select
              id="shift-select"
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              disabled={isStarting || !selectedYear}
            >
              {availableExams
                .filter(exam => exam.year === selectedYear)
                .map(exam => (
                  <option key={exam._id} value={exam.shift}>
                    {exam.shift.replace(/_/g, " ")}
                  </option>
                ))}
            </select>
          </div>

          <button 
            type="submit" 
            className="primary-button"
            disabled={isStarting || !selectedShift}
          >
            {isStarting ? <Loader size="small" /> : "Start Exam"}
          </button>
        </form>
      </section>

      {attempts.length > 0 && (
        <section className="attempt-history">
          <h3>Previous Attempts</h3>
          <div className="attempt-list">
            {attempts.map(attempt => (
              <div key={attempt._id} className="attempt-card">
                <div className="attempt-meta">
                  <span>{attempt.examYear}</span>
                  <span>{attempt.examShift.replace(/_/g, " ")}</span>
                  <span>Score: {attempt.score}</span>
                </div>
                <button 
                  className="text-button"
                  onClick={() => navigate(`/attempt/${attempt._id}`)}
                >
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;