// src/components/features/input/TranscriptInput.jsx
import React from 'react';
import { FaPaperclip } from 'react-icons/fa';
import FileChip from '../../ui/FileChip.jsx';

const TranscriptInput = ({ 
  inputTranscript, 
  onInputChange, 
  attachedFiles, 
  onFileChange, 
  onRemoveFile, 
  fileErrors, 
  validationErrors, 
  onFocus 
}) => {
  return (
    <div className="relative mb-6">
      <div
        className="w-full p-4 border border-gray-400 rounded-md"
        style={{
          minHeight: "140px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {attachedFiles.map((file, index) => (
          <FileChip
            key={index}
            file={file}
            index={index}
            onRemove={onRemoveFile}
          />
        ))}

        <textarea
          value={inputTranscript}
          onChange={onInputChange}
          onFocus={() => onFocus("inputTranscript")}
          placeholder={
            attachedFiles.length > 0
              ? ""
              : "Paste your meeting transcript here or attach transcript files..."
          }
          className="w-full h-full bg-transparent border-none focus:outline-none resize-none"
          rows={7}
          disabled={attachedFiles.length > 0}
        />
      </div>

      <input
        type="file"
        onChange={onFileChange}
        multiple
        accept=".txt,.pdf,.doc,.docx"
        className="hidden"
        id="attach-transcript-files"
      />
      <label
        htmlFor="attach-transcript-files"
        className="absolute bottom-3 right-4 cursor-pointer"
        title="Attach transcript files"
      >
        <FaPaperclip className="text-gray-600" size={20} />
      </label>

      {fileErrors.attachFiles && (
        <div className="text-red-500 text-sm mt-2">{fileErrors.attachFiles}</div>
      )}
      {validationErrors.inputTranscript && (
        <div className="text-red-500 text-sm mt-2">{validationErrors.inputTranscript}</div>
      )}
    </div>
  );
};

export default TranscriptInput;