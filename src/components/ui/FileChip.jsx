// src/components/ui/FileChip.jsx
import React from 'react';
import { FaTimes, FaFileAlt, FaFilePdf, FaFileWord } from 'react-icons/fa';

const FileChip = ({ file, index, onRemove }) => {
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (extension === 'pdf') return <FaFilePdf className="text-red-500 w-4 h-4" />;
    if (['doc', 'docx'].includes(extension)) return <FaFileWord className="text-blue-600 w-4 h-4" />;
    return <FaFileAlt className="text-gray-500 w-4 h-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle both file objects and file-like objects
  const fileName = file.name || file.file?.name || 'Unknown file';
  const fileSize = file.size || file.file?.size || 0;

  return (
    <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2 mb-2">
      <div className="flex items-center space-x-2">
        {getFileIcon(fileName)}
        <div className="flex flex-col">
          <span className="font-medium truncate max-w-[150px]" title={fileName}>
            {fileName}
          </span>
          <span className="text-xs text-blue-600">
            {formatFileSize(fileSize)}
          </span>
        </div>
      </div>
      <button
        onClick={() => onRemove(index)}
        className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
        title="Remove file"
      >
        <FaTimes className="w-3 h-3" />
      </button>
    </div>
  );
};

export default FileChip;
