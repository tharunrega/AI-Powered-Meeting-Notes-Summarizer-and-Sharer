// Groq model information based on https://console.groq.com/docs/models
export const groqModels = [
  {
    id: 'llama3-70b-8192',
    name: 'Llama-3 70B',
    description: 'Meta\'s latest large language model with 70B parameters',
    maxTokens: 8192,
    recommended: true,
  },
  {
    id: 'llama3-8b-8192',
    name: 'Llama-3 8B',
    description: 'Meta\'s latest language model with 8B parameters',
    maxTokens: 8192,
  },
  {
    id: 'gemma-7b-it',
    name: 'Gemma 7B',
    description: 'Google\'s lightweight open model with 7B parameters',
    maxTokens: 8192,
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B',
    description: 'Mistral AI\'s mixture of experts model with very large context',
    maxTokens: 32768,
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    description: 'Anthropic\'s most powerful model for highly complex tasks',
    maxTokens: 4096,
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    description: 'Anthropic\'s balanced model for performance and efficiency',
    maxTokens: 4096,
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    description: 'Anthropic\'s fastest and most compact model',
    maxTokens: 4096,
  }
];

// OpenAI model information
export const openAIModels = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI\'s most capable and cost-effective model',
    maxTokens: 4096,
    recommended: true,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'OpenAI\'s most powerful model for complex tasks',
    maxTokens: 4096,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'OpenAI\'s fast and efficient model with good quality results',
    maxTokens: 4096,
  }
];
