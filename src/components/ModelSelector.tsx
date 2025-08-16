'use client';

import { useState } from 'react';
import { groqModels, openAIModels } from '@/lib/models';

interface ModelSelectorProps {
  provider: 'groq' | 'openai';
  setProvider: (provider: 'groq' | 'openai') => void;
  modelId: string;
  setModelId: (modelId: string) => void;
}

export default function ModelSelector({
  provider,
  setProvider,
  modelId,
  setModelId
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the current models based on provider
  const models = provider === 'groq' ? groqModels : openAIModels;
  
  // Get the currently selected model name
  const selectedModel = models.find(model => model.id === modelId) || 
                        (provider === 'groq' ? groqModels[0] : openAIModels[0]);
  
  // Set default model when provider changes
  const handleProviderChange = (newProvider: 'groq' | 'openai') => {
    setProvider(newProvider);
    // Set default model for the selected provider
    if (newProvider === 'groq') {
      setModelId(groqModels[0].id);
    } else {
      setModelId(openAIModels[0].id);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-black">AI Provider & Model</label>
        <div className="relative inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => handleProviderChange('groq')}
            className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium ${
              provider === 'groq' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-black-700 hover:bg-black-50'
            } border border-black-300`}
          >
            Groq
          </button>
          <button
            type="button"
            onClick={() => handleProviderChange('openai')}
            className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium ${
              provider === 'openai' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-black-700 hover:bg-black-50'
            } border border-gray-300`}
          >
            OpenAI
          </button>
        </div>
      </div>
      
      <div className="relative mt-1">
        <button
          type="button"
          className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center">
            <span className="ml-3 block truncate">{selectedModel.name}</span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {models.map((model) => (
              <div
                key={model.id}
                className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                  model.id === modelId ? 'bg-blue-100 text-blue-900' : 'text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setModelId(model.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-black">{model.name}</span>
                  <span className="text-xs text-black">{model.description}</span>
                </div>
                
                {model.recommended && (
                  <span className="absolute right-2 top-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    Recommended
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="mt-1 text-xs text-gray-500">
        {provider === 'groq' ? 
          'Groq is known for extremely fast inference speeds' : 
          'OpenAI provides reliable results for complex tasks'}
      </p>
    </div>
  );
}
