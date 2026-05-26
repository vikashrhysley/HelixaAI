/**
 * llamaService.js
 * ─────────────────────────────────────────────────────────────
 * Meta LLaMA integration — THREE provider options:
 *
 *  1. Groq       (fastest, free tier)   → set REACT_APP_LLAMA_PROVIDER=groq
 *  2. Together AI (great free tier)     → set REACT_APP_LLAMA_PROVIDER=together
 *  3. Ollama     (local, fully private) → set REACT_APP_LLAMA_PROVIDER=ollama
 *
 * To activate:
 *  1. Copy .env.example → .env
 *  2. Uncomment your chosen provider block and add your API key
 *  3. The AIService router (aiService.js) auto-picks the provider
 * ─────────────────────────────────────────────────────────────
 */

const PROVIDER = process.env.REACT_APP_LLAMA_PROVIDER; // 'groq' | 'together' | 'ollama'

// ── Groq ──────────────────────────────────────────────────────
async function callGroq(modelId, messages) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
    },
    body: JSON.stringify({ model: modelId, messages, max_tokens: 1000 }),
  });
  if (!res.ok) throw new Error(`Groq error: HTTP ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? 'No response.';
}

// ── Together AI ───────────────────────────────────────────────
async function callTogether(modelId, messages) {
  const res = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_TOGETHER_API_KEY}`,
    },
    body: JSON.stringify({ model: modelId, messages, max_tokens: 1000 }),
  });
  if (!res.ok) throw new Error(`Together AI error: HTTP ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? 'No response.';
}

// ── Ollama (local) ────────────────────────────────────────────
async function callOllama(modelId, messages) {
  const base = process.env.REACT_APP_OLLAMA_BASE_URL ?? 'http://localhost:11434';
  // Map HuggingFace model IDs → Ollama model names
  const ollamaName = modelId.includes('70b') ? 'llama3:70b'
    : modelId.includes('8b')  ? 'llama3:8b'
    : 'llama3';

  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: ollamaName, messages, stream: false }),
  });
  if (!res.ok) throw new Error(`Ollama error: HTTP ${res.status}`);
  const data = await res.json();
  return data.message?.content ?? 'No response.';
}

// ── Public API ────────────────────────────────────────────────
/**
 * @param {string} modelId
 * @param {{ role: string; content: string }[]} messages
 * @returns {Promise<string>}
 */
export async function callLlama(modelId, messages) {
  switch (PROVIDER) {
    case 'groq':    return callGroq(modelId, messages);
    case 'together': return callTogether(modelId, messages);
    case 'ollama':  return callOllama(modelId, messages);
    default:
      throw new Error(
        'LLaMA provider not configured. Set REACT_APP_LLAMA_PROVIDER in your .env file.'
      );
  }
}
