// src/components/features/results/AnalysisResults.jsx
import React, { useState } from 'react';
import { FaCopy, FaCheck, FaProjectDiagram, FaFileAlt, FaVideo, FaTable, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const AnalysisResults = ({ analysisOutput, selectedFormats, error }) => {
  const [copiedSections, setCopiedSections] = useState(new Set());
  const [dismissedError, setDismissedError] = useState(false);

  const handleCopy = async (content, sectionId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedSections(prev => new Set([...prev, sectionId]));
      setTimeout(() => {
        setCopiedSections(prev => {
          const newSet = new Set(prev);
          newSet.delete(sectionId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Function to convert technical errors to user-friendly messages
  const getUserFriendlyError = (errorDetail) => {
    if (!errorDetail) return null;

    const errorMessage = typeof errorDetail === 'string' ? errorDetail : errorDetail.detail || errorDetail.message || '';

    // File encoding errors
    if (errorMessage.includes("utf-8") && errorMessage.includes("codec can't decode")) {
      return {
        title: "Invalid File Format",
        message: "The uploaded file appears to be in an unsupported format. Please ensure you upload a plain text file (.txt) containing your transcript.",
        suggestion: "Try saving your transcript as a .txt file and upload again."
      };
    }

    // File reading errors
    if (errorMessage.includes("Failed to read and decode file")) {
      return {
        title: "File Reading Error",
        message: "Unable to read the uploaded file. The file might be corrupted or in an incompatible format.",
        suggestion: "Please check your file and try uploading a valid text file (.txt)."
      };
    }

    // Network/Backend errors
    if (errorMessage.includes("Network Error") || errorMessage.includes("fetch")) {
      return {
        title: "Connection Error",
        message: "Unable to connect to the server. Please check your internet connection.",
        suggestion: "Try refreshing the page and submitting again."
      };
    }

    // Server errors (5xx)
    if (errorMessage.includes("500") || errorMessage.includes("Internal Server Error")) {
      return {
        title: "Server Error",
        message: "Our server is experiencing issues. This is not your fault.",
        suggestion: "Please try again in a few minutes. If the problem persists, contact support."
      };
    }

    // Authentication/Permission errors
    if (errorMessage.includes("401") || errorMessage.includes("403") || errorMessage.includes("Unauthorized")) {
      return {
        title: "Access Error",
        message: "You don't have permission to perform this action.",
        suggestion: "Please log in again or contact support if the issue continues."
      };
    }

    // File size errors
    if (errorMessage.includes("too large") || errorMessage.includes("file size")) {
      return {
        title: "File Too Large",
        message: "The uploaded file is too large to process.",
        suggestion: "Please upload a smaller file (recommended: less than 10MB)."
      };
    }

    // Empty or invalid content errors
    if (errorMessage.includes("empty") || errorMessage.includes("no content")) {
      return {
        title: "Empty File",
        message: "The uploaded file appears to be empty or contains no readable content.",
        suggestion: "Please check your file and ensure it contains transcript text."
      };
    }

    // Processing/Analysis errors
    if (errorMessage.includes("analysis") || errorMessage.includes("processing")) {
      return {
        title: "Analysis Error",
        message: "We encountered an issue while analyzing your transcript.",
        suggestion: "Please ensure your transcript contains clear business process information and try again."
      };
    }

    // Generic error fallback
    return {
      title: "Something Went Wrong",
      message: "We encountered an unexpected error while processing your request.",
      suggestion: "Please try again. If the problem continues, contact our support team."
    };
  };

  const ErrorDisplay = ({ error }) => {
    if (!error || dismissedError) return null;

    const friendlyError = getUserFriendlyError(error);
    if (!friendlyError) return null;

    return (
      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <FaExclamationTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-red-800 font-semibold text-sm mb-1">{friendlyError.title}</h4>
              <p className="text-red-700 text-sm mb-2">{friendlyError.message}</p>
              <p className="text-red-600 text-sm font-medium">💡 {friendlyError.suggestion}</p>
            </div>
          </div>
          <button
            onClick={() => setDismissedError(true)}
            className="text-red-400 hover:text-red-600 transition-colors ml-2 flex-shrink-0"
            title="Dismiss error"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  /**
   * Parse the new API response format
   * API returns: { summary_table: {...}, bpmn_diagram: "...", process_description: {...}, synthesia_script: "...", media_mapping: "..." }
   */
  const parseAnalysisOutput = (output) => {
    const sections = {};
    
    // Handle Summary Table (always present if any format selected)
    if (output.summary_table) {
      try {
        const summaryData = typeof output.summary_table === 'string' 
          ? JSON.parse(output.summary_table) 
          : output.summary_table;
        
        sections.summary = {
          raw: JSON.stringify(summaryData, null, 2),
          json: summaryData,
          display: JSON.stringify(summaryData, null, 2)
        };
      } catch (e) {
        console.error('Error parsing summary_table:', e);
      }
    }
    
    // Handle BPMN Diagram
    if (output.bpmn_diagram) {
      sections.bpmn = {
        raw: output.bpmn_diagram,
        xml: output.bpmn_diagram,
        display: output.bpmn_diagram
      };
    }
    
    // Handle Process Description
    if (output.process_description) {
      try {
        const processData = typeof output.process_description === 'string' 
          ? JSON.parse(output.process_description) 
          : output.process_description;
        
        sections.processDoc = {
          raw: JSON.stringify(processData, null, 2),
          json: processData,
          display: JSON.stringify(processData, null, 2)
        };
      } catch (e) {
        console.error('Error parsing process_description:', e);
      }
    }
    
    // Handle Synthesia Script
    if (output.synthesia_script) {
      sections.synthesiaScript = {
        raw: output.synthesia_script,
        text: output.synthesia_script,
        display: output.synthesia_script
      };
    }
    
    // Handle Media Mapping
    if (output.media_mapping) {
      sections.synthesiaMedia = {
        raw: output.media_mapping,
        text: output.media_mapping,
        display: output.media_mapping
      };
    }
    
    return sections;
  };

  const CopyButton = ({ content, sectionId, label = "Copy" }) => (
    <button
      onClick={() => handleCopy(content, sectionId)}
      className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
      title="Copy to clipboard"
    >
      {copiedSections.has(sectionId) ? (
        <>
          <FaCheck className="h-3 w-3" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <FaCopy className="h-3 w-3" />
          <span>{label}</span>
        </>
      )}
    </button>
  );

  const SubSection = ({ title, description, content, sectionId, type = "code" }) => (
    <div className="border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div>
          <h5 className="font-medium text-gray-800">{title}</h5>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <CopyButton content={content} sectionId={sectionId} />
      </div>
      <div className="p-3">
        <div className="bg-white border border-gray-100 rounded">
          <pre className="p-3 text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );

  // Show error if there's an error, regardless of analysis output
  if (error) {
    return (
      <div className="border-t pt-6 mt-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Analysis Results</h3>
        <ErrorDisplay error={error} />
      </div>
    );
  }

  // Show nothing if no analysis output and no error
  if (!analysisOutput) return null;

  const sections = parseAnalysisOutput(analysisOutput);

  return (
    <div className="border-t pt-6 mt-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Analysis Results</h3>
      
      {/* Error Display (if any) */}
      <ErrorDisplay error={error} />
      
      <div className="space-y-8">
        
        {/* 1. SUMMARY TABLE Section */}
        {sections.summary && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center space-x-3">
                <FaTable className="h-6 w-6 text-blue-600" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">SUMMARY TABLE (JSON)</h4>
                  <p className="text-sm text-gray-600">High-level overview of all identified business processes from the transcript</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <SubSection
                title="Process Summary"
                description="JSON summary of identified processes with roles, systems, and outcomes"
                content={sections.summary.display}
                sectionId="summary-main"
              />
            </div>
          </div>
        )}

        {/* 2. BPMN DIAGRAM Section */}
        {selectedFormats?.bpmn && sections.bpmn && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-green-50">
              <div className="flex items-center space-x-3">
                <FaProjectDiagram className="h-6 w-6 text-green-600" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">BPMN DIAGRAM</h4>
                  <p className="text-sm text-gray-600">Business Process Model and Notation for visual workflow representation</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <SubSection
                title="BPMN SWIMLANE DIAGRAM (XML)"
                description="BPMN XML format compatible with Lucidchart and other BPMN tools"
                content={sections.bpmn.display}
                sectionId="bpmn-xml"
              />
            </div>
          </div>
        )}

        {/* 3. PROCESS DOCUMENTATION Section */}
        {selectedFormats?.processDoc && sections.processDoc && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-purple-50">
              <div className="flex items-center space-x-3">
                <FaFileAlt className="h-6 w-6 text-purple-600" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">PROCESS DOCUMENTATION</h4>
                  <p className="text-sm text-gray-600">Detailed business process documentation with step-by-step procedures</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <SubSection
                title="PROCESS DESCRIPTION DOCUMENT (JSON)"
                description="Detailed process documentation with personas, steps, and exception handling"
                content={sections.processDoc.display}
                sectionId="process-doc"
              />
            </div>
          </div>
        )}

        {/* 4. TRAINING CONTENT Section */}
        {selectedFormats?.trainingScript && (sections.synthesiaScript || sections.synthesiaMedia) && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-orange-50">
              <div className="flex items-center space-x-3">
                <FaVideo className="h-6 w-6 text-orange-600" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">TRAINING CONTENT</h4>
                  <p className="text-sm text-gray-600">Synthesia-ready training materials for video generation</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {sections.synthesiaScript && (
                <SubSection
                  title="SYNTHESIA SCRIPT (Plain Text)"
                  description="Training script for video generation with scene-by-scene narration"
                  content={sections.synthesiaScript.display}
                  sectionId="synthesia-script"
                  type="text"
                />
              )}
              {sections.synthesiaMedia && (
                <SubSection
                  title="SYNTHESIA MEDIA MAPPING (Plain Text)"
                  description="Timestamp mapping for media content and video synchronization"
                  content={sections.synthesiaMedia.display}
                  sectionId="synthesia-media"
                  type="text"
                />
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AnalysisResults;
