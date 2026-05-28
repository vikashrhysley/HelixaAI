export const MODELS = [
  { id: 'gpt-mini', label: 'OpenAI GPT-4o mini', provider: 'openai', active: true },
  { id: 'gpt', label: 'OpenAI GPT-4o', provider: 'openai', active: true },
  { id: 'claude', label: 'Claude Sonnet 4.6', provider: 'anthropic', active: true },
  { id: 'claude-opus', label: 'Claude Opus 4.7', provider: 'anthropic', active: true },
  { id: 'grok', label: 'xAI Grok', provider: 'xai', active: true },
  { id: 'grok-mini', label: 'xAI Grok Mini', provider: 'xai', active: true },
  { id: 'deepseek', label: 'DeepSeek', provider: 'deepseek', active: true },
  { id: 'deepseek-r1', label: 'DeepSeek R1', provider: 'deepseek', active: true },
];

export const DEFAULT_MODEL = 'gpt-mini';

export const PROVIDER_LABELS = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  xai: 'xAI',
  deepseek: 'DeepSeek',
};
