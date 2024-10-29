import React from 'react';
import { MessageSquare, Loader } from 'lucide-react';

interface ChatResponseProps {
  response: string;
  isLoading: boolean;
}

export function ChatResponse({ response, isLoading }: ChatResponseProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 bg-gray-50 border-b flex items-center">
        <MessageSquare className="w-5 h-5 text-gray-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">AI Response</h2>
      </div>
      <div className="p-4 min-h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">
            {response || 'AI response will appear here...'}
          </p>
        )}
      </div>
    </div>
  );
}