import { createSlice } from '@reduxjs/toolkit';
import { generateId, truncate } from '../../utils/helpers';

const DELETED_CONVERSATIONS_KEY = 'helixta_deleted_conversations';

const loadDeletedConversationIds = () => {
  if (typeof window === 'undefined') return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(DELETED_CONVERSATIONS_KEY));
    return Array.isArray(value) ? value.map(String) : [];
  } catch {
    return [];
  }
};

const saveDeletedConversationIds = (ids) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DELETED_CONVERSATIONS_KEY, JSON.stringify(ids));
};

const makeWelcomeChat = () => ({
  id: 'c1',
  conversationId: null,
  title: 'Getting started',
  historyLoaded: true,
  messages: [
    {
      id: 'm0',
      role: 'assistant',
      content: 'Hello! I\'m HelixtaAI, your intelligent assistant. How can I help you today?',
      attachments: [],
      ts: Date.now(),
    },
  ],
  ts: Date.now(),
});

const getTimestamp = (value) => {
  const parsed = value ? Date.parse(value) : NaN;
  return Number.isNaN(parsed) ? Date.now() : parsed;
};

const getConversationTitle = (conversation, messages = []) => {
  const firstUserMessage = messages.find((message) => message.role === 'user')?.content;
  return conversation?.title || truncate(firstUserMessage || `Conversation ${conversation?.id ?? ''}`.trim());
};

const mapConversation = (conversation, existingChat) => ({
  id: existingChat?.id || `conversation-${conversation.id}`,
  conversationId: conversation.id,
  title: existingChat?.title && existingChat.title !== `Conversation ${conversation.id}`
    ? existingChat.title
    : getConversationTitle(conversation),
  historyLoaded: existingChat?.historyLoaded || false,
  messages: existingChat?.messages || [],
  ts: getTimestamp(conversation.created_at),
});

const mapConversationMessages = (messages = []) => messages.map((message) => ({
  id: `message-${message.id}`,
  role: message.role,
  content: message.content,
  attachments: [],
  model: message.model,
  ts: getTimestamp(message.created_at),
}));

const hasMessageContent = (messages = []) => messages.some((message) => message.content?.trim());
const isDeletedConversation = (state, conversationId) => (
  state.deletedConversationIds.includes(String(conversationId))
);

const mapLoadedConversation = (conversation, existingChat) => {
  const messages = mapConversationMessages(conversation.messages);
  return {
    id: existingChat?.id || `conversation-${conversation.id}`,
    conversationId: conversation.id,
    title: getConversationTitle(conversation, messages),
    historyLoaded: true,
    messages,
    ts: getTimestamp(conversation.created_at),
  };
};

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [makeWelcomeChat()],
    activeChatId: 'c1',
    loading: false,
    error: null,
    deletedConversationIds: loadDeletedConversationIds(),
  },
  reducers: {
    newChat(state) {
      const id = generateId();
      state.chats.unshift({ id, conversationId: null, title: 'New chat', historyLoaded: true, messages: [], ts: Date.now() });
      state.activeChatId = id;
    },
    setActiveChat(state, { payload: id }) {
      state.activeChatId = id;
    },
    setChatConversationId(state, { payload: { chatId, conversationId } }) {
      const chat = state.chats.find((c) => c.id === chatId);
      if (chat) {
        chat.conversationId = conversationId;
        chat.historyLoaded = true;
      }
    },
    setConversationList(state, { payload: conversations = [] }) {
      const apiChats = conversations
        .filter((conversation) => !isDeletedConversation(state, conversation.id))
        .map((conversation) => {
          const existingChat = state.chats.find((chat) => chat.conversationId === conversation.id);
          return mapConversation(conversation, existingChat);
        });
      const apiIds = new Set(apiChats.map((chat) => chat.conversationId));
      const localChats = state.chats.filter((chat) => (
        !chat.conversationId
        || !apiIds.has(chat.conversationId)
      ) && (chat.id !== 'c1' || apiChats.length === 0));

      state.chats = [...localChats, ...apiChats];
      if (!state.chats.some((chat) => chat.id === state.activeChatId)) {
        state.activeChatId = state.chats[0]?.id || 'c1';
      }
    },
    setConversationHistory(state, { payload: conversations = [] }) {
      const apiChats = conversations
        .filter((conversation) => (
          !isDeletedConversation(state, conversation.id)
          && hasMessageContent(conversation.messages)
        ))
        .map((conversation) => {
          const existingChat = state.chats.find((chat) => chat.conversationId === conversation.id);
          return mapLoadedConversation(conversation, existingChat);
        });

      const localChats = state.chats.filter((chat) => (
        !chat.conversationId
        && (chat.id !== 'c1' || apiChats.length === 0)
      ));

      state.chats = [...localChats, ...apiChats];
      if (!state.chats.some((chat) => chat.id === state.activeChatId)) {
        state.activeChatId = state.chats[0]?.id || 'c1';
      }
    },
    setConversationMessages(state, { payload: conversation }) {
      if (isDeletedConversation(state, conversation.id)) return;

      const messages = mapConversationMessages(conversation.messages);
      const chat = state.chats.find((item) => item.conversationId === conversation.id);
      if (!chat) {
        state.chats.unshift({
          id: `conversation-${conversation.id}`,
          conversationId: conversation.id,
          title: getConversationTitle(conversation, messages),
          historyLoaded: true,
          messages,
          ts: getTimestamp(conversation.created_at),
        });
        state.activeChatId = `conversation-${conversation.id}`;
        return;
      }

      chat.title = getConversationTitle(conversation, messages);
      chat.messages = messages;
      chat.historyLoaded = true;
      chat.ts = getTimestamp(conversation.created_at);
    },
    deleteChat(state, { payload: id }) {
      const chat = state.chats.find((c) => c.id === id);
      if (chat?.conversationId) {
        const deletedId = String(chat.conversationId);
        if (!state.deletedConversationIds.includes(deletedId)) {
          state.deletedConversationIds.push(deletedId);
          saveDeletedConversationIds(state.deletedConversationIds);
        }
      }

      state.chats = state.chats.filter((c) => c.id !== id);
      if (state.activeChatId === id && state.chats.length > 0) {
        state.activeChatId = state.chats[0].id;
      }
      if (state.chats.length === 0) {
        const welcomeChat = makeWelcomeChat();
        state.chats = [welcomeChat];
        state.activeChatId = welcomeChat.id;
      }
    },
    addUserMessage(state, { payload: { content, attachments = [] } }) {
      const chat = state.chats.find((c) => c.id === state.activeChatId);
      if (!chat) return;
      chat.messages.push({ id: generateId(), role: 'user', content, attachments, ts: Date.now() });
      if (!chat.messages.some((m) => m.role === 'user' && m.content !== content) && content.trim()) {
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
    startAssistantMessage(state, { payload: { id } }) {
      const chat = state.chats.find((c) => c.id === state.activeChatId);
      if (!chat) return;
      chat.messages.push({ id, role: 'assistant', content: '', attachments: [], ts: Date.now() });
      state.loading = true;
    },
    appendAssistantMessageChunk(state, { payload: { id, delta } }) {
      const chat = state.chats.find((c) => c.id === state.activeChatId);
      if (!chat) return;
      const message = chat.messages.find((m) => m.id === id);
      if (message) message.content += delta;
    },
    updateMessageContent(state, { payload: { id, content } }) {
      const chat = state.chats.find((c) => c.id === state.activeChatId);
      if (!chat) return;
      const message = chat.messages.find((m) => m.id === id);
      if (!message) return;

      message.content = content;
      if (message.role === 'user') {
        const firstUserMessage = chat.messages.find((m) => m.role === 'user');
        if (firstUserMessage?.id === id && content.trim()) {
          chat.title = truncate(content.trim());
        }
      }
    },
    removeMessage(state, { payload: id }) {
      const chat = state.chats.find((c) => c.id === state.activeChatId);
      if (!chat) return;
      chat.messages = chat.messages.filter((message) => message.id !== id);
    },
    finishAssistantMessage(state) {
      state.loading = false;
    },
    setLoading(state, { payload }) {
      state.loading = payload;
    },
    setError(state, { payload }) {
      state.error = payload;
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  newChat,
  setActiveChat,
  setChatConversationId,
  setConversationList,
  setConversationHistory,
  setConversationMessages,
  deleteChat,
  addUserMessage,
  addAssistantMessage,
  startAssistantMessage,
  appendAssistantMessageChunk,
  updateMessageContent,
  removeMessage,
  finishAssistantMessage,
  setLoading,
  setError,
  clearError,
} = chatSlice.actions;
export default chatSlice.reducer;

export const selectChats = (s) => s.chat.chats;
export const selectActiveChatId = (s) => s.chat.activeChatId;
export const selectActiveChat = (s) => s.chat.chats.find((c) => c.id === s.chat.activeChatId);
export const selectLoading = (s) => s.chat.loading;
export const selectError = (s) => s.chat.error;
