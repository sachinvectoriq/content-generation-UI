import React, { useState } from 'react';
import { FaUpload, FaFileAlt, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaTimes } from 'react-icons/fa';
import Header from '../components/layout/Header.jsx';

const Dashboard = () => {
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [textContent, setTextContent] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (extension === 'pdf') return <FaFilePdf className="text-red-500 w-5 h-5" />;
    if (['doc', 'docx'].includes(extension)) return <FaFileWord className="text-blue-600 w-5 h-5" />;
    if (['xls', 'xlsx'].includes(extension)) return <FaFileExcel className="text-green-600 w-5 h-5" />;
    if (['ppt', 'pptx'].includes(extension)) return <FaFilePowerpoint className="text-orange-500 w-5 h-5" />;
    return <FaFileAlt className="text-gray-500 w-5 h-5" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setAttachedFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileId) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedContent(`Generated content based on your input:\n\nText: ${textContent}\n\nFiles processed: ${attachedFiles.length}\n\nThis is where your AI-generated content would appear...`);
      setIsGenerating(false);
    }, 2000);
  };

  const handleClearAll = () => {
    setTextContent('');
    setAttachedFiles([]);
    setGeneratedContent('');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-blue-100'>
      <Header />
      
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-6xl mx-auto'>
          {/* Main Content Area */}
          <div className='bg-white rounded-lg shadow-lg p-8 mb-6'>
            {/* Text Input Area */}
            <div className='mb-6'>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder='Enter text or attach document(s)'
                className='w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
              />
              
              {/* File Upload Section */}
              <div className='mt-4 flex items-center justify-between'>
                <div className='flex items-center'>
                  <label className='cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-800'>
                    <FaUpload className='w-5 h-5' />
                    <span>Attach Files</span>
                    <input
                      type='file'
                      multiple
                      className='hidden'
                      onChange={handleFileUpload}
                      accept='.pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx'
                    />
                  </label>
                </div>
              </div>

              {/* Attached Files Display */}
              {attachedFiles.length > 0 && (
                <div className='mt-4'>
                  <h3 className='text-sm font-medium text-gray-700 mb-2'>Attached Files ({attachedFiles.length}):</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                    {attachedFiles.map((fileObj) => (
                      <div key={fileObj.id} className='flex items-center justify-between bg-gray-50 p-3 rounded border hover:bg-gray-100 transition-colors'>
                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                          <div className='flex-shrink-0'>
                            {getFileIcon(fileObj.name)}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm text-gray-800 truncate' title={fileObj.name}>
                              {fileObj.name}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {formatFileSize(fileObj.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(fileObj.id)}
                          className='flex-shrink-0 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors'
                          title='Remove file'
                        >
                          <FaTimes className='w-4 h-4' />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end gap-4'>
              <button
                onClick={handleClearAll}
                className='px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors'
              >
                Clear All
              </button>
              <button
                onClick={handleGenerate}
                className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'
                disabled={(!textContent.trim() && attachedFiles.length === 0) || isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Content'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {(generatedContent || isGenerating) && (
            <div className='bg-white rounded-lg shadow-lg p-8'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4'>Generated Content</h2>
              {isGenerating ? (
                <div className='flex items-center justify-center py-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                  <span className='ml-3 text-gray-600'>Generating content...</span>
                </div>
              ) : (
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <pre className='whitespace-pre-wrap text-gray-700'>{generatedContent}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;