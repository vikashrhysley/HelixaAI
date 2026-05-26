/**
 * anthropicService.js
 * Handles all calls to the Anthropic Claude API.
 */

const BASE_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Send a conversation to Claude and return the assistant text.
 * @param {string} modelId  - e.g. "claude-sonnet-4-20250514"
 * @param {Array}  messages - [{role, content}]
 * @returns {Promise<string>}
 */
export async function callAnthropic(modelId, messages) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelId,
      max_tokens: 1000,
      system:
        'You are HelixtaAI, a helpful, concise, and friendly AI assistant. Respond naturally and helpfully.',
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? 'No response received.';
}
