/**
 * aiService.js
 * ─────────────────────────────────────────────────────────────
 * Central router: picks the right provider based on model ID.
 * Add new providers here as a simple case branch.
 * ─────────────────────────────────────────────────────────────
 */

import { callAnthropic } from './anthropicService';
import { callLlama }     from './llamaService';
import { MODELS }        from '../constants/models';

/**
 * @param {string} modelId
 * @param {{ role: string; content: string }[]} messages
 * @returns {Promise<string>}
 */
export async function sendMessage(modelId, messages) {
  const model = MODELS.find((m) => m.id === modelId);

  if (!model) throw new Error(`Unknown model: ${modelId}`);

  if (!model.active) {
    throw new Error(`${model.label} is coming soon and not yet available.`);
  }

  switch (model.provider) {
    case 'anthropic': return callAnthropic(modelId, messages);
    case 'llama':     return callLlama(modelId, messages);
    default:
      throw new Error(`No service registered for provider "${model.provider}"`);
  }
}
