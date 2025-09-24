// src/services/promptService.js
// src/services/promptService.js

// Make sure this matches your actual ngrok URL - check if it's HTTP or HTTPS
const API_BASE_URL = 'https://app-contentgen-qa-cshmb8dnhya0bdhf.eastus2-01.azurewebsites.net';

// Generic fetcher function with enhanced error handling for CORS issues
const apiRequest = async (endpoint, options = {}) => {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      // Add these headers to help with CORS
      'Accept': 'application/json',
    };

    const config = {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
      // Ensure credentials are included if needed
      credentials: 'omit', // Try 'include' if your backend expects cookies/auth
    };

    console.log(`Making request to: ${API_BASE_URL}${endpoint}`);
    console.log('Request config:', config);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Log response for debugging
    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, response.headers);

    if (!response.ok) {
      // Enhanced error handling
      let errorMessage = `API request failed with status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (parseError) {
        // If we can't parse the error response, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    // Handle empty response (like 204 No Content)
    if (response.status === 204 || response.headers.get('Content-Length') === '0') {
      return { message: 'Success' };
    }

    return await response.json();
    
  } catch (error) {
    console.error("API Error:", error);
    
    // Specific handling for CORS errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Please check if the backend server is running and CORS is properly configured');
    }
    
    throw error;
  }
};

// Test connection function
export const testConnection = async () => {
  try {
    // Try a simple GET request to test connectivity
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
      },
      credentials: 'omit',
    });
    
    console.log('Connection test response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

// ----- API METHODS -----

// GET all prompts
export const getPrompts = () => {
  return apiRequest('/prompts', { method: 'GET' });
};

// POST a new prompt
export const createPrompt = (newPrompt) => {
  if (!newPrompt) throw new Error('New prompt data is required');
  
  // Validate required fields
  if (!newPrompt.name) throw new Error('Prompt name is required');
  
  return apiRequest('/prompts', {
    method: 'POST',
    body: JSON.stringify(newPrompt),
  });
};

// DELETE a prompt by ID
export const deletePrompt = (promptId) => {
  if (!promptId) throw new Error('promptId is required for DELETE');
  return apiRequest(`/prompts/${promptId}`, {
    method: 'DELETE',
  });
};

// PATCH (update) a prompt by ID
export const updatePrompt = (promptId, updatedFields) => {
  if (!promptId) throw new Error('promptId is required for PATCH');
  if (!updatedFields || Object.keys(updatedFields).length === 0) {
    throw new Error('updatedFields are required for PATCH');
  }
  
  return apiRequest(`/prompts/${promptId}`, {
    method: 'PATCH',
    body: JSON.stringify(updatedFields),
  });
};

// Token limit functions - these should also use real API if available
export const getPromptTokenLimit = async () => {
  try {
    // Replace this with actual API call when backend supports it
    // return apiRequest('/token-limit', { method: 'GET' });
    
    // For now, using mock data
    return new Promise(resolve => 
      setTimeout(() => resolve({ limit: 4000 }), 500)
    );
  } catch (error) {
    console.error('Error fetching token limit:', error);
    throw error;
  }
};

export const updatePromptTokenLimit = async (limitData) => {
  try {
    if (!limitData || typeof limitData.limit === 'undefined') {
      throw new Error('Token limit data is required');
    }
    
    // Replace this with actual API call when backend supports it
    // return apiRequest('/token-limit', {
    //   method: 'PATCH',
    //   body: JSON.stringify(limitData),
    // });
    
    // For now, using mock data
    return new Promise(resolve => 
      setTimeout(() => resolve({ limit: limitData.limit }), 500)
    );
  } catch (error) {
    console.error('Error updating token limit:', error);
    throw error;
  }
};
