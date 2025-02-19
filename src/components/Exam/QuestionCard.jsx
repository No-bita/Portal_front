import React, { useCallback } from 'react';
import { debounce } from 'lodash'; // Add this import

const QuestionCard = ({ question, answer, onAnswerChange }) => {
  // 1. Memoized debounced handler using useCallback
  const debouncedChangeHandler = useCallback(
    debounce((value) => {
      onAnswerChange(value);
    }, 500),
    [onAnswerChange]
  );

  // 2. Unified change handler
  const handleChange = (value) => {
    // Immediate feedback for UI
    const processedValue = question.type === 'MCQ' ? value : Number(value);
    debouncedChangeHandler(processedValue);
  };

  // 3. Proper type checking and null safety
  const currentAnswer = answer !== null && answer !== undefined ? answer : '';

  return (
    <div className="question-card" role="region" aria-label="Exam Question">
      {/* 4. Accessible image with fallback */}
      {question.image && (
        <img 
          src={question.image} 
          alt={`Visual representation of question ${question.question_id}`}
          role="presentation"
        />
      )}
      
      {question.type === 'MCQ' ? (
        <div className="options-grid" role="group" aria-label="Multiple Choice Options">
          {question.options.map((option, index) => (
            <button
              key={`option-${question.question_id}-${index}`} // Better key
              className={answer === index + 1 ? 'selected' : ''}
              onClick={() => handleChange(index + 1)}
              role="radio"
              aria-checked={answer === index + 1}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <input
          type="number"
          value={currentAnswer}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter integer answer"
          aria-label="Numeric answer input"
        />
      )}
    </div>
  );
};

export default QuestionCard; // Fixed casing to match component name