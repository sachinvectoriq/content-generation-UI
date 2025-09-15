// src/components/features/modals/FeedbackModal.jsx
import React from 'react';

const FeedbackModal = ({
  isOpen,
  selectedOutput,
  feedbackOption,
  customFeedback,
  feedbackSubmitted,
  onFeedbackOptionChange,
  onCustomFeedbackChange,
  onSubmit,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white border border-gray-400 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">
          Feedback for <span className="text-blue-600 capitalize">{selectedOutput}</span>
        </h3>
        
        <select
          value={feedbackOption}
          onChange={(e) => onFeedbackOptionChange(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-4"
        >
          <option value="">Select feedback option</option>
          <option value="Content was inaccurate">Content was inaccurate</option>
          <option value="Missing important information">Missing important information</option>
          <option value="Format not as expected">Format not as expected</option>
          <option value="Other">Other</option>
        </select>
        
        {feedbackOption === "Other" && (
          <textarea
            placeholder="Please specify your feedback..."
            className="w-full border border-gray-300 rounded p-2 mb-4"
            rows="3"
            value={customFeedback}
            onChange={(e) => onCustomFeedbackChange(e.target.value)}
          />
        )}
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!feedbackOption || (feedbackOption === "Other" && !customFeedback)}
          >
            Submit
          </button>
        </div>
        
        {feedbackSubmitted && (
          <div className="text-green-500 text-center mt-2">Feedback submitted!</div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;