// src/components/features/results/GeneratedResults.jsx
import React from 'react';
import { FaDownload } from 'react-icons/fa';
import ResultsTable from './ResultsTable.jsx';

const GeneratedResults = ({ 
  generatedFiles, 
  onDownload, 
  onCopy, 
  onDownloadAll,
  onThumbsUp, 
  onThumbsDown 
}) => {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">Generated Content</h3>
      
      <ResultsTable
        generatedFiles={generatedFiles}
        onDownload={onDownload}
        onCopy={onCopy}
        onThumbsUp={onThumbsUp}
        onThumbsDown={onThumbsDown}
      />

      <div className="mt-4 flex justify-center">
        <button
          onClick={onDownloadAll}
          className="bg-green-500 text-white flex items-center rounded px-6 py-2 hover:bg-green-600"
        >
          <FaDownload className="mr-2" />
          Download All Files
        </button>
      </div>
    </div>
  );
};

export default GeneratedResults;