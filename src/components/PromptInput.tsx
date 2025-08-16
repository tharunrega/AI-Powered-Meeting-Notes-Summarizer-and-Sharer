'use client';

import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

export default function PromptInput({ prompt, setPrompt }: PromptInputProps) {
  const promptExamples = [
    "Summarize in bullet points",
    "List all action items",
    "Identify key decisions made",
    "Extract main topics discussed",
    "Create a timeline of the meeting"
  ];

  return (
    <div className="space-y-3">
      <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
        Custom Prompt (Instructions for AI)
      </label>
      <textarea
        id="prompt"
        className="rounded-md border border-gray-300 text-black shadow-sm p-3 w-full focus:ring-blue-500 focus:border-blue-500"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter instructions for how to summarize the transcript..."
      />
      <div className="text-sm">
        <span className="text-gray-500">Examples:</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {promptExamples.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setPrompt(example)}
              className="bg-gray-100 hover:bg-gray-200 text-sm rounded-md px-3 py-1 text-gray-700 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
