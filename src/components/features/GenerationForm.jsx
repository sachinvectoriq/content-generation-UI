// src/components/features/GenerationForm.jsx
import React, { useState } from "react";
import TranscriptInput from "./input/TranscriptInput.jsx";
import FormatSelector from "./input/FormatSelector.jsx";
import ActionButtons from "./input/ActionButtons.jsx";
import GeneratedResults from "./results/GeneratedResults.jsx";
import FeedbackModal from "../modals/FeedbackModal.jsx";
import Toast from "../ui/Toast.jsx";

const GenerationForm = () => {
  const [inputTranscript, setInputTranscript] = useState("");
  const [generatedOutputs, setGeneratedOutputs] = useState({
    bpmn: null,
    processDoc: null,
    trainingScript: null
  });
  
  // Output format selection
  const [selectedFormats, setSelectedFormats] = useState({
    bpmn: false,
    processDoc: false,
    trainingScript: false
  });
  
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState([]);
  
  // Feedback states
  const [feedbackStates, setFeedbackStates] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOutput, setSelectedOutput] = useState("");
  const [feedbackOption, setFeedbackOption] = useState("");
  const [customFeedback, setCustomFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // File handling for transcript uploads
  const [fileErrors, setFileErrors] = useState({
    attachFiles: "",
  });

  const handleGenerate = async () => {
    const errors = {};
    
    if (!inputTranscript.trim() && attachedFiles.length === 0) {
      errors.inputTranscript = "Please enter transcript text or attach transcript files.";
    }
    
    if (!selectedFormats.bpmn && !selectedFormats.processDoc && !selectedFormats.trainingScript) {
      errors.outputFormats = "Please select at least one output format.";
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsGenerating(true);

    try {
      // Simulate API call for content generation
      const mockGeneratedFiles = [];
      
      if (selectedFormats.bpmn) {
        mockGeneratedFiles.push({
          type: 'bpmn',
          name: 'Process_Diagram.xml',
          content: 'Generated BPMN XML content...',
          status: 'completed'
        });
      }
      
      if (selectedFormats.processDoc) {
        mockGeneratedFiles.push({
          type: 'processDoc',
          name: 'Process_Documentation.docx',
          content: 'Generated process document content...',
          status: 'completed'
        });
      }
      
      if (selectedFormats.trainingScript) {
        mockGeneratedFiles.push({
          type: 'trainingScript',
          name: 'Training_Script.txt',
          content: 'Generated Synthesia training script...',
          status: 'completed'
        });
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGeneratedFiles(mockGeneratedFiles);
      
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setInputTranscript("");
    setGeneratedOutputs({ bpmn: null, processDoc: null, trainingScript: null });
    setSelectedFormats({ bpmn: false, processDoc: false, trainingScript: false });
    setAttachedFiles([]);
    setGeneratedFiles([]);
    setCopied(false);
    setValidationErrors({});
    setFileErrors({ attachFiles: "" });
    setFeedbackStates({});
  };

  const handleInputTranscriptChange = (e) => {
    const newText = e.target.value;
    setInputTranscript(newText);
    setAttachedFiles([]);
    setGeneratedFiles([]);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const unsupportedFiles = files.filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      return !["txt", "pdf", "doc", "docx"].includes(extension);
    });

    if (unsupportedFiles.length > 0) {
      setFileErrors((prev) => ({
        ...prev,
        attachFiles: "*Unsupported file format. Please use txt, pdf, doc, or docx files.",
      }));
    } else {
      setFileErrors((prev) => ({ ...prev, attachFiles: "" }));
      setAttachedFiles((prev) => [...prev, ...files]); 
      setInputTranscript("");
      setGeneratedFiles([]);
    }
  };

  const removeFile = (index) => {
    setAttachedFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleFormatChange = (format) => {
    setSelectedFormats(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openFeedbackModal = (outputType) => {
    setSelectedOutput(outputType);
    setIsModalOpen(true);
    setFeedbackSubmitted(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFeedbackOption("");
    setCustomFeedback("");
    setFeedbackSubmitted(false);
  };

  const submitFeedback = async () => {
    // Mock feedback submission
    console.log('Feedback submitted for:', selectedOutput, feedbackOption, customFeedback);
    setFeedbackSubmitted(true);
    setTimeout(() => {
      closeModal();
    }, 1500);
  };

  const downloadFile = (file) => {
    // Mock download functionality
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllFiles = () => {
    generatedFiles.forEach(file => {
      if (file.status === 'completed') {
        downloadFile(file);
      }
    });
  };

  const handleFocus = (field) => {
    setValidationErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleThumbsUp = (fileType) => {
    console.log('Thumbs up for', fileType);
  };

  const handleThumbsDown = (fileType) => {
    openFeedbackModal(fileType);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-[800px] min-h-[500px] p-6 mt-[30px] bg-white shadow-lg rounded-lg">
        
        {/* Header 
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Content Generation</h2>
          <p className="text-gray-600">Transform meeting transcripts into structured business documentation</p>
        </div>*/}

        {/* Transcript Input Component */}
        <TranscriptInput
          inputTranscript={inputTranscript}
          onInputChange={handleInputTranscriptChange}
          attachedFiles={attachedFiles}
          onFileChange={handleFileChange}
          onRemoveFile={removeFile}
          fileErrors={fileErrors}
          validationErrors={validationErrors}
          onFocus={handleFocus}
        />

        {/* Format Selector Component */}
        <FormatSelector
          selectedFormats={selectedFormats}
          onFormatChange={handleFormatChange}
          validationErrors={validationErrors}
        />

        {/* Action Buttons Component */}
        <ActionButtons
          onClear={handleClear}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          inputTranscript={inputTranscript}
          attachedFiles={attachedFiles}
          generatedFiles={generatedFiles}
        />

        {/* Generated Results Component */}
        {generatedFiles.length > 0 && (
          <GeneratedResults
            generatedFiles={generatedFiles}
            onDownload={downloadFile}
            onCopy={handleCopy}
            onDownloadAll={downloadAllFiles}
            onThumbsUp={handleThumbsUp}
            onThumbsDown={handleThumbsDown}
          />
        )}

        {/* Feedback Modal Component */}
        <FeedbackModal
          isOpen={isModalOpen}
          selectedOutput={selectedOutput}
          feedbackOption={feedbackOption}
          customFeedback={customFeedback}
          feedbackSubmitted={feedbackSubmitted}
          onFeedbackOptionChange={setFeedbackOption}
          onCustomFeedbackChange={setCustomFeedback}
          onSubmit={submitFeedback}
          onClose={closeModal}
        />

        {/* Toast Notification Component */}
        <Toast
          message="Copied to clipboard!"
          isVisible={copied}
          type="success"
        />
      </div>
    </div>
  );
};

export default GenerationForm;