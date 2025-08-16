'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface TranscriptUploadProps {
  transcript: string;
  setTranscript: (transcript: string) => void;
}

export default function TranscriptUpload({ transcript, setTranscript }: TranscriptUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        setTranscript(fileContent);
      };
      reader.readAsText(file);
    }
  }, [setTranscript]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt']
    },
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue">Drop the file here...</p>
        ) : (
          <div>
            <p className="mb-2 text-black">Drop a .txt file here, or click to select a file</p>
            <p className="text-sm text-black">Only .txt files are accepted</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="transcript" className="text-sm font-medium text-black">
            Or paste transcript here:
          </label>
          <button
            type="button"
            onClick={async () => {
              try {
                const response = await fetch('/sample-transcript.txt');
                const text = await response.text();
                setTranscript(text);
              } catch (error) {
                console.error('Error loading sample transcript:', error);
              }
            }}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Load sample transcript
          </button>
        </div>
        <textarea
          id="transcript"
          rows={10}
          className="rounded-md text-black border border-gray-300 shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript here..."
        />
      </div>

      {transcript && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-black mb-1">Transcript Preview:</h3>
          <div className="bg-gray-50 rounded-md p-3 text-black border border-gray-200 max-h-60 overflow-auto">
            <pre className="whitespace-pre-wrap text-sm">{transcript}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
