import React, { useState, useCallback, useEffect } from 'react';
import { WebcamComponent } from './components/WebcamComponent';
import { TranscriptionBox } from './components/TranscriptionBox';
import { ChatResponse } from './components/ChatResponse';
import { AlertCircle } from 'lucide-react';
import { GeminiService } from './services/gemini';
import { isGeminiConfigured } from './config/constants';

function App() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isGeminiConfigured()) {
      setError('Please configure your Gemini API key in the environment variables (VITE_GEMINI_API_KEY)');
    }
  }, []);

  const recognition = useCallback(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      return recognition;
    }
    return null;
  }, []);

  const handleGetAIResponse = async (text: string) => {
    if (!isGeminiConfigured()) {
      setError('Gemini API key is not configured');
      return;
    }

    setIsLoading(true);
    try {
      const response = await GeminiService.getResponse(text);
      setAiResponse(response);
      setError('');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to get AI response');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleListening = useCallback(() => {
    const recognitionInstance = recognition();
    if (!recognitionInstance) {
      setError('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionInstance.stop();
    } else {
      recognitionInstance.start();
      recognitionInstance.onresult = async (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(prev => prev + ' ' + transcript);

        if (event.results[current].isFinal) {
          await handleGetAIResponse(transcript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
    }

    setIsListening(!isListening);
  }, [isListening, recognition]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Real-time Interview Assistant
        </h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <WebcamComponent onError={setError} />
          <TranscriptionBox
            transcript={transcript}
            isListening={isListening}
            onToggleListening={handleToggleListening}
          />
        </div>

        <ChatResponse response={aiResponse} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App;