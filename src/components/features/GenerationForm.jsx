// src/components/features/GenerationForm.jsx
import React, { useState } from "react";
import TranscriptInput from "./input/TranscriptInput.jsx";
import FormatSelector from "./input/FormatSelector.jsx";
import ActionButtons from "./input/ActionButtons.jsx";
import GroupedAnalysisResults from "./results/AnalysisResults.jsx";
import Toast from "../ui/Toast.jsx";
import analysisService from "../../services/analysisService.js";

const GenerationForm = () => {
  const [inputTranscript, setInputTranscript] = useState("");
  const [analysisOutput, setAnalysisOutput] = useState(null);
  
  // Output format selection - mapped to API format
  const [selectedFormats, setSelectedFormats] = useState({
    bpmn: false,
    processDoc: false,
    trainingScript: false
  });
  
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState(null);

  // File handling for transcript uploads
  const [fileErrors, setFileErrors] = useState({
    attachFiles: "",
  });

  // Map UI formats to API format
  const mapFormatsToApiOutputs = (formats) => {
    const outputs = [];
    
    // Always include summary if any format is selected
    if (formats.bpmn || formats.processDoc || formats.trainingScript) {
      outputs.push("summary");
    }
    
    if (formats.bpmn) outputs.push("bpmn");
    if (formats.processDoc) outputs.push("process_description");
    if (formats.trainingScript) {
      outputs.push("synthesia_script");
      outputs.push("synthesia_media");
    }
    
    return outputs;
  };

  const handleGenerate = async () => {
    const errors = {};
    setApiError(null);
    
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
      // Prepare API parameters
      const selectedOutputs = mapFormatsToApiOutputs(selectedFormats);
      
      const apiParams = {
        selectedOutputs,
        ...(attachedFiles.length > 0 
          ? { transcriptFile: attachedFiles[0].file || attachedFiles[0] }
          : { transcript: inputTranscript }
        )
      };

      console.log('Sending API request with params:', {
        selectedOutputs,
        hasFile: !!apiParams.transcriptFile,
        hasText: !!apiParams.transcript
      });

      const response = await analysisService.analyzeTranscript(apiParams);
      
      if (response.success) {
        setAnalysisOutput(response.data);
        console.log('Analysis completed successfully');
      } else {
        setApiError(response.error);
        console.error('Analysis failed:', response.error);
      }
      
    } catch (error) {
      console.error("Generation error:", error);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setInputTranscript("");
    setAnalysisOutput(null);
    setSelectedFormats({ bpmn: false, processDoc: false, trainingScript: false });
    setAttachedFiles([]);
    setCopied(false);
    setValidationErrors({});
    setFileErrors({ attachFiles: "" });
    setApiError(null);
  };

  const handleInputTranscriptChange = (e) => {
    const newText = e.target.value;
    setInputTranscript(newText);
    setAttachedFiles([]);
    setAnalysisOutput(null);
    setApiError(null);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const supportedExtensions = ["txt", "pdf", "doc", "docx"];
    const unsupportedFiles = files.filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      return !supportedExtensions.includes(extension);
    });

    if (unsupportedFiles.length > 0) {
      setFileErrors((prev) => ({
        ...prev,
        attachFiles: "*Unsupported file format. Please use txt, pdf, doc, or docx files.",
      }));
    } else {
      setFileErrors((prev) => ({ ...prev, attachFiles: "" }));
      
      // Store files with proper structure
      const formattedFiles = files.map(file => ({
        file: file,
        name: file.name,
        size: file.size,
        type: file.type
      }));
      
      setAttachedFiles(formattedFiles);
      setInputTranscript("");
      setAnalysisOutput(null);
      setApiError(null);
    }
  };

  const removeFile = (index) => {
    setAttachedFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    setAnalysisOutput(null);
    setApiError(null);
  };

  const handleFormatChange = (format) => {
    setSelectedFormats(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
    setAnalysisOutput(null);
  };

  const handleFocus = (field) => {
    setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError(null);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-[800px] min-h-[500px] p-6 mt-[30px] bg-white shadow-lg rounded-lg">

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
          generatedFiles={[]} // Not used anymore, but keeping for compatibility
        />

        {/* API Error Display */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="text-red-800">
              <strong>Error:</strong> {apiError}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="flex items-center justify-center py-8 mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Analyzing transcript...</span>
          </div>
        )}

        {/* Analysis Results Component */}
        {analysisOutput && !isGenerating && (
          <GroupedAnalysisResults 
            analysisOutput={analysisOutput} 
            selectedFormats={selectedFormats} 
          />
        )}

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
