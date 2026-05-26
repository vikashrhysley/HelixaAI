import { createSlice } from '@reduxjs/toolkit';
import { generateId, truncate } from '../../utils/helpers';

const makeWelcomeChat = () => ({
  id: 'c1',
  title: 'Getting started',
  messages: [
    {
      id: 'm0',
      role: 'assistant',
      content: 'Hello! I\'m HelixtaAI, your intelligent assistant. How can I help you today? ✨',
      attachments: [],
      ts: Date.now(),
    },
  ],
  ts: Date.now(),
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [makeWelcomeChat()],
    activeChatId: 'c1',
    loading: false,
    error: null,
  },
  reducers: {
    // ── Chat management ──────────────────────────────────────
    newChat(state) {
      const id = generateId();
      state.chats.unshift({ id, title: 'New chat', messages: [], ts: Date.now() });
      state.activeChatId = id;
    },
    setActiveChat(state, { payload: id }) {
      state.activeChatId = id;
    },
    deleteChat(state, { payload: id }) {
      state.chats = state.chats.filter((c) => c.id !== id);
      if (state.activeChatId === id && state.chats.length > 0) {
        state.activeChatId = state.chats[0].id;
      }
    },

    // ── Message management ───────────────────────────────────
    addUserMessage(state, { payload: { content, attachments = [] } }) {
      const chat = state.chats.find((c) => c.id === state.activeChatId);
      if (!chat) return;
      const msg = { id: generateId(), role: 'user', content, attachments, ts: Date.now() };
      chat.messages.push(msg);
      if (chat.messages.length === 1 && content.trim()) {
        chat.title = truncate(content.trim());
      }
      state.loading = true;
      state.error = null;
    },
    addAssistantMessage(state, { payload: content }) {
      const chat = state.chats.find((c) => c.id === state.activeChatId);
      if (!chat) return;
      chat.messages.push({ id: generateId(), role: 'assistant', content, attachments: [], ts: Date.now() });
      state.loading = false;
    },
    setLoading(state, { payload }) { state.loading = payload; },
    setError(state, { payload }) {
      state.error = payload;
      state.loading = false;
    },
  },
});

export const {
  newChat, setActiveChat, deleteChat,
  addUserMessage, addAssistantMessage,
  setLoading, setError,
} = chatSlice.actions;
export default chatSlice.reducer;

// Selectors
export const selectChats        = (s) => s.chat.chats;
export const selectActiveChatId = (s) => s.chat.activeChatId;
export const selectActiveChat   = (s) => s.chat.chats.find((c) => c.id === s.chat.activeChatId);
export const selectLoading      = (s) => s.chat.loading;
export const selectError        = (s) => s.chat.error;
