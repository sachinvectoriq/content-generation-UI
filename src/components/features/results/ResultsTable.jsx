// src/components/features/results/ResultsTable.jsx
import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { FaTimes, FaProjectDiagram, FaFileAlt, FaVideo } from 'react-icons/fa';
import FileActions from './FileActions.jsx';
// import FeedbackSection from './FeedbackSection.jsx'; // Feedback functionality temporarily removed

const ResultsTable = ({ 
  generatedFiles, 
  onDownload, 
  onCopy, 
  onThumbsUp, 
  onThumbsDown 
}) => {
  const getFileIcon = (type) => {
    switch (type) {
      case 'bpmn':
        return <FaProjectDiagram className="h-5 w-5 text-blue-500" />;
      case 'processDoc':
        return <FaFileAlt className="h-5 w-5 text-green-500" />;
      case 'trainingScript':
        return <FaVideo className="h-5 w-5 text-purple-500" />;
      default:
        return <FaFileAlt className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 p-3 text-left">Output Type</th>
            <th className="border border-gray-300 p-3 text-left">File Name</th>
            <th className="border border-gray-300 p-3 text-center">Status</th>
            <th className="border border-gray-300 p-3 text-center">Actions</th>
            {/*
            <th className="border border-gray-300 p-3 text-center">Feedback</th> 
            Feedback column temporarily removed
            */}
          </tr>
        </thead>
        <tbody>
          {generatedFiles.map((file, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-3">
                <div className="flex items-center">
                  {getFileIcon(file.type)}
                  <span className="ml-2 capitalize">{file.type.replace(/([A-Z])/g, ' $1')}</span>
                </div>
              </td>
              <td className="border border-gray-300 p-3">{file.name}</td>
              <td className="border border-gray-300 p-3 text-center">
                {file.status === 'completed' ? (
                  <CheckIcon className="h-6 w-6 text-green-600 mx-auto" />
                ) : (
                  <FaTimes className="h-6 w-6 text-red-600 mx-auto" />
                )}
              </td>
              <td className="border border-gray-300 p-3">
                <FileActions 
                  file={file}
                  onDownload={onDownload}
                  onCopy={onCopy}
                />
              </td>
              {/*
              <td className="border border-gray-300 p-3">
                <FeedbackSection
                  file={file}
                  onThumbsUp={onThumbsUp}
                  onThumbsDown={onThumbsDown}
                />
              </td>
              Feedback cell temporarily removed
              */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
