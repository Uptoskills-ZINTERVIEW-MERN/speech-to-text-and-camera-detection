import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface TranscriptionBoxProps {
  transcript: string;
  isListening: boolean;
  onToggleListening: () => void;
}

export function TranscriptionBox({
  transcript,
  isListening,
  onToggleListening,
}: TranscriptionBoxProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Speech Transcription</h2>
        <button
          onClick={onToggleListening}
          className={`p-2 rounded-full ${
            isListening
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}
        >
          {isListening ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="p-4 h-[300px] overflow-y-auto">
        <p className="text-gray-700 whitespace-pre-wrap">{transcript || 'Start speaking to see transcription...'}</p>
      </div>
    </div>
  );
}