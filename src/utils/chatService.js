const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://23.108.100.247:8004';

async function parseJsonResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = data?.detail;
    if (typeof detail === 'string') throw new Error(detail);
    throw new Error(data?.message || `Request failed with HTTP ${response.status}`);
  }

  return data;
}

export async function startChat(accessToken) {
  const response = await fetch(`${API_BASE_URL}/chat/start`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseJsonResponse(response);
}

export async function listConversations(accessToken) {
  const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseJsonResponse(response);
}

export async function getConversation(accessToken, conversationId) {
  const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseJsonResponse(response);
}

export async function streamChat({ accessToken, conversationId, message, model, signal, onMeta, onChunk, onDone }) {
  const response = await fetch(`${API_BASE_URL}/chat/stream`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
      model,
    }),
    signal,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const detail = data?.detail;
    throw new Error(typeof detail === 'string' ? detail : data?.message || `Request failed with HTTP ${response.status}`);
  }

  if (!response.body) {
    throw new Error('Streaming is not supported by this browser.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const handleLine = async (line) => {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.startsWith('data:')) return;

    const payload = trimmed.slice(5).trim();
    if (!payload || payload === '[DONE]') return;

    let event;
    try {
      event = JSON.parse(payload);
    } catch {
      throw new Error('The model returned an invalid response stream.');
    }

    if (event.type === 'error') {
      throw new Error(event.message || event.detail || 'The selected model failed to respond.');
    }

    if (event.type === 'meta') await onMeta?.(event);
    if (event.type === 'chunk') await onChunk?.(event.delta ?? '');
    if (event.type === 'done') await onDone?.(event);
  };

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      await handleLine(line);
    }

    if (done) break;
  }

  if (buffer.trim()) await handleLine(buffer);
}
