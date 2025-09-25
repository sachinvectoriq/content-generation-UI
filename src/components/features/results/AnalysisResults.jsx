// src/components/features/results/AnalysisResults.jsx
import React, { useState } from 'react';
import { FaCopy, FaCheck, FaProjectDiagram, FaFileAlt, FaVideo, FaTable } from 'react-icons/fa';

const AnalysisResults = ({ analysisOutput, selectedFormats }) => {
  const [copiedSections, setCopiedSections] = useState(new Set());

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

  const extractJsonFromMarkdown = (text) => {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    return jsonMatch ? jsonMatch[1] : null;
  };

  const extractXmlFromMarkdown = (text) => {
    const xmlMatch = text.match(/```xml\n([\s\S]*?)\n```/);
    return xmlMatch ? xmlMatch[1] : null;
  };

  const extractCodeFromMarkdown = (text, language = '') => {
    const codeMatch = text.match(new RegExp(`\`\`\`${language}\\n([\\s\\S]*?)\\n\`\`\``));
    return codeMatch ? codeMatch[1] : null;
  };

  const parseAnalysisOutput = (output) => {
    const sections = {};
    
    // Split by main headings (###)
    const parts = output.split(/### \d+\.\s+/);
    
    parts.forEach((part, index) => {
      if (index === 0) return; // Skip the intro part
      
      const lines = part.split('\n');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();
      
      // Extract different types of content
      if (title.includes('SUMMARY TABLE')) {
        const jsonContent = extractJsonFromMarkdown(content);
        sections.summary = {
          raw: content,
          json: jsonContent,
          display: jsonContent ? JSON.stringify(JSON.parse(jsonContent), null, 2) : content
        };
      } else if (title.includes('BPMN SWIMLANE DIAGRAM')) {
        const xmlContent = extractXmlFromMarkdown(content);
        sections.bpmn = {
          raw: content,
          xml: xmlContent,
          display: xmlContent || content
        };
      } else if (title.includes('PROCESS DESCRIPTION DOCUMENT')) {
        const jsonContent = extractJsonFromMarkdown(content);
        sections.processDoc = {
          raw: content,
          json: jsonContent,
          display: jsonContent ? JSON.stringify(JSON.parse(jsonContent), null, 2) : content
        };
      } else if (title.includes('SYNTHESIA SCRIPT')) {
        // Remove markdown formatting for plain text
        const cleanContent = content.replace(/```plaintext\n|\n```/g, '').replace(/#### /g, '');
        sections.synthesiaScript = {
          raw: content,
          text: cleanContent,
          display: cleanContent
        };
      } else if (title.includes('SYNTHESIA MEDIA MAPPING')) {
        const mappingContent = extractCodeFromMarkdown(content, 'plaintext');
        sections.synthesiaMedia = {
          raw: content,
          text: mappingContent || content.replace(/```plaintext\n|\n```/g, ''),
          display: mappingContent || content.replace(/```plaintext\n|\n```/g, '')
        };
      }
    });
    
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

  if (!analysisOutput) return null;

  const sections = parseAnalysisOutput(analysisOutput);

  return (
    <div className="border-t pt-6 mt-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">Analysis Results</h3>
      
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
