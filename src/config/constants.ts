// Store API configuration
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Validation
export const isGeminiConfigured = () => {
  return GEMINI_API_KEY !== '';
};