// src/components/features/results/AnalysisResults.jsx
import React, { useState } from 'react';
import { FaCopy, FaCheck, FaProjectDiagram, FaFileAlt, FaVideo, FaTable, FaExclamationTriangle, FaTimes, FaInfoCircle } from 'react-icons/fa';

const AnalysisResults = ({ analysisOutput, selectedFormats, error }) => {
  const [copiedSections, setCopiedSections] = useState(new Set());
  const [dismissedError, setDismissedError] = useState(false);
  const [dismissedWarnings, setDismissedWarnings] = useState(new Set());

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

  const getUserFriendlyError = (errorDetail) => {
    if (!errorDetail) return null;

    const errorMessage = typeof errorDetail === 'string' ? errorDetail : errorDetail.detail || errorDetail.message || '';

    if (errorMessage.includes("utf-8") && errorMessage.includes("codec can't decode")) {
      return {
        title: "Invalid File Format",
        message: "The uploaded file appears to be in an unsupported format. Please ensure you upload a plain text file (.txt) containing your transcript.",
        suggestion: "Try saving your transcript as a .txt file and upload again."
      };
    }

    if (errorMessage.includes("Failed to read and decode file")) {
      return {
        title: "File Reading Error",
        message: "Unable to read the uploaded file. The file might be corrupted or in an incompatible format.",
        suggestion: "Please check your file and try uploading a valid text file (.txt)."
      };
    }

    if (errorMessage.includes("Network Error") || errorMessage.includes("fetch")) {
      return {
        title: "Connection Error",
        message: "Unable to connect to the server. Please check your internet connection.",
        suggestion: "Try refreshing the page and submitting again."
      };
    }

    if (errorMessage.includes("500") || errorMessage.includes("Internal Server Error")) {
      return {
        title: "Server Error",
        message: "Our server is experiencing issues. This is not your fault.",
        suggestion: "Please try again in a few minutes. If the problem persists, contact support."
      };
    }

    if (errorMessage.includes("401") || errorMessage.includes("403") || errorMessage.includes("Unauthorized")) {
      return {
        title: "Access Error",
        message: "You don't have permission to perform this action.",
        suggestion: "Please log in again or contact support if the issue continues."
      };
    }

    if (errorMessage.includes("too large") || errorMessage.includes("file size")) {
      return {
        title: "File Too Large",
        message: "The uploaded file is too large to process.",
        suggestion: "Please upload a smaller file (recommended: less than 10MB)."
      };
    }

    if (errorMessage.includes("empty") || errorMessage.includes("no content")) {
      return {
        title: "Empty File",
        message: "The uploaded file appears to be empty or contains no readable content.",
        suggestion: "Please check your file and ensure it contains transcript text."
      };
    }

    if (errorMessage.includes("analysis") || errorMessage.includes("processing")) {
      return {
        title: "Analysis Error",
        message: "We encountered an issue while analyzing your transcript.",
        suggestion: "Please ensure your transcript contains clear business process information and try again."
      };
    }

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

  const WarningDisplay = ({ warningId, title, message }) => {
    if (dismissedWarnings.has(warningId)) return null;

    return (
      <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <FaInfoCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-yellow-800 font-semibold text-sm mb-1">{title}</h4>
              <p className="text-yellow-700 text-sm">{message}</p>
            </div>
          </div>
          <button
            onClick={() => setDismissedWarnings(prev => new Set([...prev, warningId]))}
            className="text-yellow-400 hover:text-yellow-600 transition-colors ml-2 flex-shrink-0"
            title="Dismiss warning"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  /**
   * Check if a section has valid content
   */
  const hasValidContent = (data) => {
    if (!data) return false;
    
    if (typeof data === 'string') {
      const trimmed = data.trim();
      // Check for empty XML definitions
      if (trimmed === '<definitions></definitions>' || trimmed === '<definitions />') return false;
      // Check for empty or placeholder content
      if (trimmed === '' || trimmed === '```' || trimmed === '```text') return false;
      return trimmed.length > 0;
    }
    
    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        return data.length > 0;
      }
      // Check if object has meaningful content
      return Object.keys(data).length > 0 && JSON.stringify(data) !== '{}';
    }
    
    return false;
  };

  /**
   * Validate summary table structure
   */
  const isValidSummaryTable = (summaryData) => {
    if (!summaryData || !summaryData.summary_table) return false;
    if (!Array.isArray(summaryData.summary_table)) return false;
    if (summaryData.summary_table.length === 0) return false;
    
    // Check if at least one entry has required fields
    return summaryData.summary_table.some(entry => 
      entry.process_name && entry.process_name.trim().length > 0
    );
  };

  /**
   * Validate process description structure
   */
  const isValidProcessDescription = (processData) => {
    if (!processData || !processData.process_description) return false;
    const pd = processData.process_description;
    
    // Check for empty overview
    if (!pd.overview || pd.overview.trim().length === 0) return false;
    
    // Check for personas array
    if (!Array.isArray(pd.personas) || pd.personas.length === 0) return false;
    
    return true;
  };

  /**
   * Parse the API response with comprehensive edge case handling
   */
  const parseAnalysisOutput = (output) => {
    const sections = {};
    const warnings = [];
    
    // Handle Summary Table
    if (output.summary_table) {
      try {
        const summaryData = typeof output.summary_table === 'string' 
          ? JSON.parse(output.summary_table) 
          : output.summary_table;
        
        if (isValidSummaryTable(summaryData)) {
          sections.summary = {
            raw: JSON.stringify(summaryData, null, 2),
            json: summaryData,
            display: JSON.stringify(summaryData, null, 2),
            valid: true
          };
        } else {
          warnings.push({
            id: 'empty-summary',
            title: 'No Processes Identified',
            message: 'The analysis could not identify any business processes in the provided transcript. Please ensure your transcript contains clear business process information.'
          });
        }
      } catch (e) {
        console.error('Error parsing summary_table:', e);
        warnings.push({
          id: 'invalid-summary',
          title: 'Invalid Summary Format',
          message: 'The summary data could not be parsed. This might be due to an unexpected response format.'
        });
      }
    }
    
    // Handle BPMN Diagram
    if (output.bpmn_diagram && selectedFormats?.bpmn) {
      const bpmnContent = output.bpmn_diagram.trim();
      
      if (hasValidContent(bpmnContent) && bpmnContent !== '<definitions></definitions>') {
        sections.bpmn = {
          raw: bpmnContent,
          xml: bpmnContent,
          display: bpmnContent,
          valid: true
        };
      } else {
        warnings.push({
          id: 'empty-bpmn',
          title: 'BPMN Diagram Not Generated',
          message: 'The BPMN diagram could not be generated. The transcript may not contain sufficient information to create a process diagram.'
        });
      }
    }
    
    // Handle Process Description
    if (output.process_description && selectedFormats?.processDoc) {
      try {
        const processData = typeof output.process_description === 'string' 
          ? JSON.parse(output.process_description) 
          : output.process_description;
        
        if (isValidProcessDescription(processData)) {
          sections.processDoc = {
            raw: JSON.stringify(processData, null, 2),
            json: processData,
            display: JSON.stringify(processData, null, 2),
            valid: true
          };
        } else {
          warnings.push({
            id: 'empty-process-doc',
            title: 'Process Documentation Not Generated',
            message: 'The process documentation could not be created. Please ensure your transcript contains detailed process steps and role information.'
          });
        }
      } catch (e) {
        console.error('Error parsing process_description:', e);
        warnings.push({
          id: 'invalid-process-doc',
          title: 'Invalid Process Documentation',
          message: 'The process documentation could not be parsed correctly.'
        });
      }
    }
    
    // Handle Synthesia Script
    if (output.synthesia_script && selectedFormats?.trainingScript) {
      const scriptContent = output.synthesia_script.trim();
      
      if (hasValidContent(scriptContent) && scriptContent !== '```' && scriptContent !== '```text') {
        sections.synthesiaScript = {
          raw: scriptContent,
          text: scriptContent,
          display: scriptContent,
          valid: true
        };
      } else {
        warnings.push({
          id: 'empty-synthesia-script',
          title: 'Training Script Not Generated',
          message: 'The training script could not be created. The transcript may not contain enough narrative content for script generation.'
        });
      }
    }
    
    // Handle Media Mapping
    if (output.media_mapping && selectedFormats?.trainingScript) {
      const mediaContent = output.media_mapping.trim();
      
      if (hasValidContent(mediaContent)) {
        sections.synthesiaMedia = {
          raw: mediaContent,
          text: mediaContent,
          display: mediaContent,
          valid: true
        };
      }
    }
    
    return { sections, warnings };
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

  // Show error if there's an error
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

  const { sections, warnings } = parseAnalysisOutput(analysisOutput);
  
  // Calculate success rate based on 50% rule
  const requestedSections = [];
  if (selectedFormats?.bpmn) requestedSections.push('bpmn');
  if (selectedFormats?.processDoc) requestedSections.push('processDoc');
  if (selectedFormats?.trainingScript) requestedSections.push('synthesiaScript');
  
  // Always expect summary if any format is selected
  if (requestedSections.length > 0) requestedSections.push('summary');
  
  const validSections = Object.entries(sections).filter(([key, section]) => section?.valid);
  const successRate = requestedSections.length > 0 
    ? (validSections.length / requestedSections.length) * 100 
    : 0;
  
  // Apply 50% Rule: If less than 50% success, show error only
  const shouldShowError = successRate < 50;

  return (
    <div className="border-t pt-6 mt-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Analysis Results</h3>
      
      {/* Show error if success rate is below 50% */}
      {shouldShowError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start space-x-3">
            <FaExclamationTriangle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-yellow-900 font-semibold text-base mb-2">⚠️ Unable to process file</h4>
              <p className="text-yellow-800 text-sm">
                Please upload a valid transcript containing business process information.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Show content with warnings if success rate is 50% or above */}
      {!shouldShowError && (
        <>
          {/* Display warnings for partially missing content */}
          {warnings.length > 0 && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <FaInfoCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-blue-900 font-semibold text-sm mb-1">Partial Content Generated</h4>
                  <p className="text-blue-800 text-sm">
                    Some content couldn't be generated. Your transcript may be incomplete or missing specific details.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      <div className="space-y-8">
        
        {/* Only show sections if success rate is 50% or above */}
        {!shouldShowError && (
          <>
            {/* 1. SUMMARY TABLE Section */}
            {sections.summary?.valid && (
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
            {sections.bpmn?.valid && (
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
            {sections.processDoc?.valid && (
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
            {(sections.synthesiaScript?.valid || sections.synthesiaMedia?.valid) && (
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
                  {sections.synthesiaScript?.valid && (
                    <SubSection
                      title="SYNTHESIA SCRIPT (Plain Text)"
                      description="Training script for video generation with scene-by-scene narration"
                      content={sections.synthesiaScript.display}
                      sectionId="synthesia-script"
                      type="text"
                    />
                  )}
                  {sections.synthesiaMedia?.valid && (
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
          </>
        )}

      </div>
    </div>
  );
};

export default AnalysisResults;
