// ─── AI Models ────────────────────────────────────────────────
export const MODELS = [
  // ── Anthropic Claude (live) ──
  { id: 'claude-sonnet-4-20250514',  label: 'Claude Sonnet 4',  provider: 'anthropic', active: true },
  { id: 'claude-opus-4-20250514',    label: 'Claude Opus 4',    provider: 'anthropic', active: true },
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5', provider: 'anthropic', active: true },

  // ── Meta LLaMA (coming soon) ──
  { id: 'meta-llama/llama-3.3-70b-instruct',  label: 'LLaMA 3.3 70B',  provider: 'llama', active: false, comingSoon: true },
  { id: 'meta-llama/llama-3.1-8b-instruct',   label: 'LLaMA 3.1 8B',   provider: 'llama', active: false, comingSoon: true },
  { id: 'meta-llama/llama-3.2-vision-11b',    label: 'LLaMA 3.2 Vision',provider: 'llama', active: false, comingSoon: true },
];

export const DEFAULT_MODEL = MODELS[0].id;

// ─── Demo Credentials ─────────────────────────────────────────
export const DEMO_USER = {
  email:    'demo@helixtaai.com',
  password: 'demo123',
  name:     'Alex Morgan',
};

// ─── Provider Badges ──────────────────────────────────────────
export const PROVIDER_LABELS = {
  anthropic: 'Anthropic',
  llama:     'Meta LLaMA',
};
