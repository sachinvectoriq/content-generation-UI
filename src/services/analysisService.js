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
      
      // Handle error responses
      if (!response.ok) {
        let errorDetails;
        
        try {
          // Try to parse error response as JSON to get the actual error details
          const errorData = await response.json();
          
          // Ensure we always return an object with a detail property
          errorDetails = {
            detail: errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
            statusText: response.statusText
          };
        } catch (parseError) {
          // If response body is not JSON, fall back to status text
          errorDetails = { 
            detail: `HTTP ${response.status}: ${response.statusText || 'Unknown error'}`,
            status: response.status,
            statusText: response.statusText
          };
        }
        
        console.error('API Error Response:', errorDetails);
        
        return {
          success: false,
          error: errorDetails
        };
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || !data.output) {
        return {
          success: false,
          error: {
            detail: 'Invalid response format from server'
          }
        };
      }
      
      return {
        success: true,
        data: data.output
      };
      
    } catch (error) {
      console.error('Analysis API error:', error);
      
      // Handle network errors or other fetch errors
      return {
        success: false,
        error: {
          detail: error.message || 'Network error. Please check your connection and try again.',
          originalError: error.name
        }
      };
    }
  }
};

export default analysisService;
