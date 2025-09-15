// src/components/features/input/ActionButtons.jsx
import React from 'react';

const ActionButtons = ({ 
  onClear, 
  onGenerate, 
  isGenerating, 
  inputTranscript, 
  attachedFiles, 
  generatedFiles 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <button
        onClick={onClear}
        className={`px-6 py-2 rounded-md text-white ${
          inputTranscript || attachedFiles.length > 0 || generatedFiles.length > 0
            ? "bg-orange-500 hover:bg-orange-600 cursor-pointer"
            : "bg-gray-400 cursor-default"
        }`}
      >
        Clear All
      </button>

      <button
        onClick={onGenerate}
        disabled={isGenerating || (!inputTranscript && attachedFiles.length === 0)}
        className={`px-6 py-2 rounded-md text-white ${
          !isGenerating && (inputTranscript || attachedFiles.length > 0)
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isGenerating ? "Generating..." : "Generate Content"}
      </button>
    </div>
  );
};

export default ActionButtons;