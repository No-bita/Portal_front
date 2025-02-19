import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { startAttempt, submitAttempt } from '../services/exam';
import QuestionCard from '../components/Exam/QuestionCard';
import Timer from '../components/Exam/Timer';
import SubjectNavigation from '../components/Exam/SubjectNavigation';
import api from '../services/api';

const Exam = () => {
  const { attemptId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Question boundaries for subjects
  const subjectBoundaries = {
    Mathematics: { start: 0, end: 29 },
    Physics: { start: 30, end: 59 },
    Chemistry: { start: 60, end: 89 }
  };

  // Load attempt and saved responses
  useEffect(() => {
    const loadAttempt = async () => {
      try {
        if (!token) return navigate('/login');
        
        // Load from backend
        const { data } = await startAttempt(2024, 'Jan_27_Shift_1');
        setQuestions(data.questions);
        
        // Load from localStorage if exists
        const savedResponses = localStorage.getItem(`attempt_${attemptId}`);
        const initialResponses = savedResponses 
          ? JSON.parse(savedResponses)
          : data.responses.reduce((acc, res) => ({
              ...acc,
              [res.questionId]: res.answer
            }), {});

        setResponses(initialResponses);
      } catch (err) {
        setError('Failed to load exam. Please try again.');
        console.error('Load attempt error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAttempt();
  }, [token, navigate, attemptId]);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`attempt_${attemptId}`, JSON.stringify(responses));
    } catch (err) {
      console.error('LocalStorage error:', err);
    }
  }, [responses, attemptId]);

  // Auto-save to backend every 30 seconds
  useEffect(() => {
    const autoSave = setInterval(async () => {
      try {
        await api.patch(`/attempts/${attemptId}`, { responses });
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }, 30000);

    return () => clearInterval(autoSave);
  }, [responses, attemptId]);

  const handleAnswerChange = useCallback((questionId, answer) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleSubjectChange = useCallback((subject) => {
    setCurrentQuestion(subjectBoundaries[subject].start);
  }, []);

  const handleQuestionNavigation = (direction) => {
    setCurrentQuestion(prev => {
      const newIndex = direction === 'next' ? prev + 1 : prev - 1;
      return Math.max(0, Math.min(questions.length - 1, newIndex));
    });
  };

  const handleSubmit = async () => {
    try {
      const submission = Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer
      }));
      
      await submitAttempt(attemptId, submission);
      localStorage.removeItem(`attempt_${attemptId}`);
      navigate(`/results/${attemptId}`);
    } catch (err) {
      setError('Submission failed. Please check your connection.');
      console.error('Submit error:', err);
    }
  };

  if (isLoading) {
    return <div className="loader">Loading Questions...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="exam-container">
      <Timer duration={10800} onTimeout={handleSubmit} /> {/* 3 hours */}
      
      <SubjectNavigation 
        boundaries={subjectBoundaries}
        onChangeSubject={handleSubjectChange}
      />

      <div className="exam-controls">
        <button 
          disabled={currentQuestion === 0}
          onClick={() => handleQuestionNavigation('prev')}
        >
          Previous
        </button>
        
        <span>
          Question {currentQuestion + 1} of {questions.length}
        </span>
        
        <button
          disabled={currentQuestion === questions.length - 1}
          onClick={() => handleQuestionNavigation('next')}
        >
          Next
        </button>
      </div>

      {questions[currentQuestion] && (
        <QuestionCard
          question={questions[currentQuestion]}
          answer={responses[questions[currentQuestion]._id] || null}
          onAnswerChange={(answer) => 
            handleAnswerChange(questions[currentQuestion]._id, answer)
          }
        />
      )}

      <button className="submit-button" onClick={handleSubmit}>
        Submit Exam
      </button>
    </div>
  );
};

export default Exam;