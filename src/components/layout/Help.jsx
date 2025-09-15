import React from 'react';
import Header from './Header.jsx';

const Help = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-blue-100'>
      <Header />
      
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-lg shadow-lg p-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-6'>Help & Documentation</h1>
            
            <div className='space-y-6'>
              <section>
                <h2 className='text-xl font-semibold text-gray-700 mb-3'>Getting Started</h2>
                <p className='text-gray-600 mb-4'>
                  Welcome to Content Generation! This application helps you generate content based on your input text and attached documents.
                </p>
              </section>

              <section>
                <h2 className='text-xl font-semibold text-gray-700 mb-3'>How to Use</h2>
                <ul className='list-disc list-inside text-gray-600 space-y-2'>
                  <li>Enter your text in the main text area</li>
                  <li>Attach relevant documents using the "Attach Files" button</li>
                  <li>Click "Generate Content" to process your input</li>
                  <li>View the generated content in the results section</li>
                </ul>
              </section>

              <section>
                <h2 className='text-xl font-semibold text-gray-700 mb-3'>Supported File Types</h2>
                <ul className='list-disc list-inside text-gray-600 space-y-2'>
                  <li>PDF files (.pdf)</li>
                  <li>Word documents (.doc, .docx)</li>
                  <li>Excel spreadsheets (.xls, .xlsx)</li>
                  <li>PowerPoint presentations (.ppt, .pptx)</li>
                  <li>Text files (.txt)</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;