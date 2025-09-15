// src/components/features/results/FeedbackSection.jsx
import React from 'react';
import { TiThumbsUp, TiThumbsDown } from 'react-icons/ti';

const FeedbackSection = ({ file, onThumbsUp, onThumbsDown }) => {
  return (
    <div className="flex justify-center space-x-2">
      <button
        onClick={() => onThumbsUp(file.type)}
        className="text-blue-500 hover:text-blue-600"
      >
        <TiThumbsUp size={24} />
      </button>
      <button
        onClick={() => onThumbsDown(file.type)}
        className="text-red-500 hover:text-red-600"
      >
        <TiThumbsDown size={24} />
      </button>
    </div>
  );
};

export default FeedbackSection;