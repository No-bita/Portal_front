import PropTypes from 'prop-types';

const SubjectNavigation = ({ subjects, activeSubject, onChangeSubject }) => {
  return (
    <nav className="bg-gray-100 p-4 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => onChangeSubject(subject)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all
              ${
                activeSubject === subject
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            aria-label={`Switch to ${subject} questions`}
          >
            {subject}
          </button>
        ))}
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4 h-2 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{
            width: `${((subjects.indexOf(activeSubject) + 1) / subjects.length) * 100}%`
          }}          
        />
      </div>
    </nav>
  );
};

SubjectNavigation.propTypes = {
  subjects: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeSubject: PropTypes.string.isRequired,
  onChangeSubject: PropTypes.func.isRequired
};

export default SubjectNavigation;