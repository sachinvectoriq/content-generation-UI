// src/services/analysisService.js
const API_BASE_URL = 'https://app-contentgen-qa-cshmb8dnhya0bdhf.eastus2-01.azurewebsites.net';

export const analysisService = {
  /**
   * Analyze transcript and generate content
   * @param {Object} params - Analysis parameters
   * @param {string} params.transcript - Text transcript (optional if file provided)
   * @param {File} params.transcriptFile - Transcript file (optional if text provided)
   * @param {string[]} params.selectedOutputs - Array of selected output types
   * @returns {Promise<Object>} API response
   */
  async analyzeTranscript({ transcript, transcriptFile, selectedOutputs }) {
    try {
      const formData = new FormData();
      
      // Add transcript file or text
      if (transcriptFile) {
        formData.append('transcript_file', transcriptFile);
      } else if (transcript) {
        // If only text is provided, create a blob and append as file
        const blob = new Blob([transcript], { type: 'text/plain' });
        formData.append('transcript_file', blob, 'transcript.txt');
      }
      
      // Add selected outputs
      formData.append('selected_outputs', JSON.stringify(selectedOutputs));
      
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data.output
      };
      
    } catch (error) {
      console.error('Analysis API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to analyze transcript'
      };
    }
  }
};

export default analysisService;
