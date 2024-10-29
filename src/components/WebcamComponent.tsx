import React, { useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';

interface WebcamComponentProps {
  onError: (error: string) => void;
}

export function WebcamComponent({ onError }: WebcamComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function setupWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        onError('Unable to access webcam. Please check your permissions.');
      }
    }

    setupWebcam();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [onError]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex items-center">
        <Camera className="w-5 h-5 text-gray-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">Video Feed</h2>
      </div>
      <div className="aspect-video bg-gray-900">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}