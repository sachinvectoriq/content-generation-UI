// src/components/ui/FileChip.jsx
import React from 'react';
import { FaFileAlt, FaRegTimesCircle } from 'react-icons/fa';

const FileChip = ({ file, onRemove, index }) => {
  return (
    <div className="flex items-center bg-gray-200 rounded-md m-1 p-2">
      <FaFileAlt className="h-5 w-5 text-blue-500 mr-2" />
      <span className="mr-2">{file.name}</span>
      <button
        onClick={() => onRemove(index)}
        className="text-red-500"
      >
        <FaRegTimesCircle />
      </button>
    </div>
  );
};

export default FileChip;