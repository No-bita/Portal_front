import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { FaFlask, FaRocket, FaPlayCircle, FaChartLine, FaBookOpen } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="hero-container">
      {/* Hero Section */}
      <header className="hero-section">
        <nav className="nav-container" aria-label="Main navigation">
          <div className="logo-container">
            <FaRocket className="logo-icon" />
            <span className="logo-text">JEEPreps</span>
          </div>
          <div className="nav-buttons">
            <Link to="/login" className="nav-login" aria-label="Login">
              Login
            </Link>
            <Link to="/register" className="nav-get-started" aria-label="Get started">
              Get Started
            </Link>
          </div>
        </nav>

        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="main-heading"
          >
            Smart Preparation for <span className="gradient-underline">JEE Mains</span>
          </motion.h1>
          
          <p className="hero-description">
            AI-powered practice tests, personalized study plans,<br /> 
            and performance analytics to help you crack<br />
            JEE Mains with confidence.
          </p>

          <div className="cta-buttons">
            <button className="primary-cta" aria-label="Start free trial">
              <FaRocket className="cta-icon" />
              Start Free Trial
            </button>
            <button className="secondary-cta" aria-label="Watch demo">
              <FaPlayCircle className="cta-icon" />
              Watch Demo
            </button>
          </div>
        </div>

        <div className="hero-illustration">
          <div className="image-wrapper">
            <img 
              src="/images/exam-interface-light.png" 
              alt="Exam Interface Preview"
              className="preview-image"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">
            Everything You Need to Succeed
          </h2>

          <div className="features-grid">
            <FeatureCard 
              icon={<FaFlask className="feature-icon" />}
              title="Real Exam Simulation"
              description="Simulate real exam conditions with:
                            - Timed mock tests
                            - Previous year patterns
                            - Detailed solution keys"
            />
            <FeatureCard 
              icon={<FaChartLine className="feature-icon" />}
              title="Smart Analytics"
              description="Detailed performance reports with:
                            - Strength/weakness analysis
                            - Topic-wise breakdown
                            - Progress tracking"/>
            <FeatureCard 
              icon={<FaBookOpen className="feature-icon" />}
              title="Adaptive Learning"
              description="Personalized study plans featuring:
- Dynamic difficulty adjustment
- Custom revision schedules
- AI-powered recommendations"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            <StatItem number="10k+" label="Practice Questions" />
            <StatItem number="98%" label="Success Rate" />
            <StatItem number="24/7" label="Accessibility" />
            <StatItem number="1.2k" label="Toppers Joined" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta-section">
        <div className="final-cta-container">
          <h2 className="cta-title">Start Your Journey Today</h2>
          <p className="cta-subtitle">
            Join thousands of successful JEE aspirants who transformed their preparation
          </p>
          <button className="final-cta-button" aria-label="Get started free">
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) controls.start("visible");
    return () => controls.stop();
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      className="feature-card"
    >
      <div className="icon-container">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </motion.div>
  );
};

const StatItem = ({ number, label }) => (
  <div className="stat-item">
    <div className="stat-number">{number}</div>
    <div className="stat-label">{label}</div>
  </div>
);

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

StatItem.propTypes = {
  number: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default LandingPage;