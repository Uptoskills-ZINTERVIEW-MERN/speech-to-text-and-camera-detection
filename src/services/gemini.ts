import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, isGeminiConfigured } from '../config/constants';

export class GeminiService {
  private static instance: GoogleGenerativeAI | null = null;

  private static getInstance(): GoogleGenerativeAI {
    if (!this.instance) {
      if (!isGeminiConfigured()) {
        throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your environment variables.');
      }
      this.instance = new GoogleGenerativeAI(GEMINI_API_KEY);
    }
    return this.instance;
  }

  static async getResponse(text: string): Promise<string> {
    try {
      const genAI = this.getInstance();
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `As an interview assistant, please provide a helpful response to: ${text}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while getting AI response');
    }
  }
}