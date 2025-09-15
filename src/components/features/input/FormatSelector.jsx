// src/components/features/input/FormatSelector.jsx
import React from 'react';
import { FaProjectDiagram, FaFileAlt, FaVideo } from 'react-icons/fa';

const FormatSelector = ({ selectedFormats, onFormatChange, validationErrors }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Select Output Formats:</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={selectedFormats.bpmn}
            onChange={() => onFormatChange('bpmn')}
            className="mr-3"
          />
          <FaProjectDiagram className="h-5 w-5 text-blue-500 mr-2" />
          <div>
            <div className="font-medium">BPMN Diagram</div>
            <div className="text-sm text-gray-500">Lucidchart-compatible XML</div>
          </div>
        </label>

        <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={selectedFormats.processDoc}
            onChange={() => onFormatChange('processDoc')}
            className="mr-3"
          />
          <FaFileAlt className="h-5 w-5 text-green-500 mr-2" />
          <div>
            <div className="font-medium">Process Document</div>
            <div className="text-sm text-gray-500">Detailed Word document</div>
          </div>
        </label>

        <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={selectedFormats.trainingScript}
            onChange={() => onFormatChange('trainingScript')}
            className="mr-3"
          />
          <FaVideo className="h-5 w-5 text-purple-500 mr-2" />
          <div>
            <div className="font-medium">Training Script</div>
            <div className="text-sm text-gray-500">Synthesia-ready narration</div>
          </div>
        </label>
      </div>
      {validationErrors.outputFormats && (
        <div className="text-red-500 text-sm mt-2">{validationErrors.outputFormats}</div>
      )}
    </div>
  );
};

export default FormatSelector;