import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getResults } from '../services/exam';
import { FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';
import Modal from '../components/Layout/Modal';

const Results = () => {
  const { attemptId } = useParams();
  const { user } = useAuth();
  const [results, setResults] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch results data
  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await getResults(attemptId);
        setResults(data);
      } catch (err) {
        setError('Failed to load results. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [attemptId]);

  // Calculate subject-wise performance
  const subjectStats = results?.questions.reduce((acc, question, index) => {
    const subject = question.subject;
    const isCorrect = results.detailedResults[index].correct;
    
    if (!acc[subject]) {
      acc[subject] = {
        correct: 0,
        incorrect: 0,
        total: 0,
        marks: 0
      };
    }
    
    acc[subject].total++;
    acc[subject].marks += results.detailedResults[index].marksAwarded;
    isCorrect ? acc[subject].correct++ : acc[subject].incorrect++;
    
    return acc;
  }, {});

  if (isLoading) return <div className="loader">Loading Results...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!results) return null;

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>Exam Results</h1>
        <div className="overall-score">
          <div className="score-card">
            <span className="score-label">Total Score</span>
            <span className="score-value">
              {results.score}/{results.maxPossibleScore}
            </span>
          </div>
          <Link to="/dashboard" className="dashboard-link">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="subject-breakdown">
        <h2>Subject-wise Performance</h2>
        <div className="subject-grid">
          {Object.entries(subjectStats).map(([subject, stats]) => (
            <div key={subject} className="subject-card">
              <h3>{subject}</h3>
              <div className="subject-stats">
                <div className="stat-item">
                  <FiCheck className="stat-icon correct" />
                  <span>{stats.correct}</span>
                </div>
                <div className="stat-item">
                  <FiX className="stat-icon incorrect" />
                  <span>{stats.incorrect}</span>
                </div>
                <div className="stat-item">
                  <span>Marks: {stats.marks}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="detailed-results">
        <h2>Question-wise Analysis</h2>
        <div className="questions-grid">
          {results.questions.map((question, index) => {
            const detail = results.detailedResults[index];
            return (
              <div
                key={question._id}
                className={`question-item ${detail.correct ? 'correct' : 'incorrect'}`}
                onClick={() => setSelectedQuestion({ question, detail })}
              >
                <span>Q{index + 1}</span>
                <div className="question-status">
                  {detail.correct ? (
                    <FiCheck className="status-icon correct" />
                  ) : (
                    <FiX className="status-icon incorrect" />
                  )}
                  <span>{detail.marksAwarded} marks</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Detail Modal */}
      {selectedQuestion && (
        <Modal onClose={() => setSelectedQuestion(null)}>
          <div className="question-modal">
            {selectedQuestion.question.image && (
              <img
                src={selectedQuestion.question.image}
                alt={`Question ${selectedQuestion.question.question_id}`}
                className="question-image"
              />
            )}
            
            <div className="answer-comparison">
              <div className="answer-item">
                <span className="answer-label">Your Answer:</span>
                <span className="answer-value">
                  {selectedQuestion.detail.userAnswer ?? 'Unattempted'}
                </span>
              </div>
              <div className="answer-item">
                <span className="answer-label">Correct Answer:</span>
                <span className="answer-value">
                  {selectedQuestion.question.answer}
                </span>
              </div>
            </div>
            
            {selectedQuestion.question.options?.length > 0 && (
              <div className="options-list">
                {selectedQuestion.question.options.map((option, idx) => (
                  <div
                    key={idx}
                    className={`option-item ${
                      idx + 1 === selectedQuestion.question.answer ? 'correct' : ''
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Results;