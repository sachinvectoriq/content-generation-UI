// src/components/features/results/FileActions.jsx
import React from 'react';
import { FaDownload, FaCopy } from 'react-icons/fa';

const FileActions = ({ file, onDownload, onCopy }) => {
  return (
    <div className="flex justify-center space-x-2">
      <button
        onClick={() => onDownload(file)}
        className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600"
        title="Download"
      >
        <FaDownload />
      </button>
      <button
        onClick={() => onCopy(file.content)}
        className="bg-green-500 text-white rounded px-3 py-1 hover:bg-green-600"
        title="Copy to clipboard"
      >
        <FaCopy />
      </button>
    </div>
  );
};

export default FileActions;