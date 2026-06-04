# Chathelix — Component-wise AI Chatbot

A production-grade AI chatbot built with **React + Redux + Tailwind CSS**, inspired by ChatGPT and Claude.

---

## 📁 Folder Structure

```
helixta-ai/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx          # Login form with validation
│   │   ├── chat/
│   │   │   ├── ChatPage.jsx           # Main chat layout (sidebar + header + messages + input)
│   │   │   ├── MessageList.jsx        # Scrollable message area + empty state
│   │   │   ├── MessageBubble.jsx      # Single message (user/bot) with attachments
│   │   │   ├── ChatInput.jsx          # Full toolbar: plus, mic, model, send
│   │   │   ├── PlusMenu.jsx           # Screenshot + Add File popup
│   │   │   └── ModelDropdown.jsx      # Model picker (Claude / LLaMA grouped)
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx            # Collapsible sidebar + chat history + logout
│   │   │   └── Header.jsx             # Chat title + dark mode toggle + menu toggle
│   │   └── ui/
│   │       ├── Avatar.jsx             # User initials avatar + BotAvatar
│   │       ├── ThinkingDots.jsx       # Animated loading dots
│   │       └── IconButton.jsx         # Reusable styled icon button
│   ├── store/
│   │   ├── index.js                   # Redux store config
│   │   └── slices/
│   │       ├── authSlice.js           # login / logout state
│   │       ├── chatSlice.js           # chats, messages, loading, error
│   │       └── uiSlice.js             # darkMode, sidebarOpen, selectedModel
│   ├── hooks/
│   │   ├── useTheme.js                # t(dark, light) helper + token map
│   │   ├── useChat.js                 # send() wrapper with Redux dispatch
│   │   └── useSpeech.js              # Web Speech API toggle hook
│   ├── utils/
│   │   ├── aiService.js               # 🔀 Router: picks provider by model
│   │   ├── anthropicService.js        # ✅ Anthropic Claude API (active)
│   │   ├── llamaService.js            # 🔜 Meta LLaMA API (ready, activate via .env)
│   │   └── helpers.js                 # generateId, formatTime, truncate, fileToBase64
│   ├── constants/
│   │   ├── models.js                  # Model list with provider + active/comingSoon flags
│   │   └── theme.js                   # Tailwind dark/light class maps
│   ├── App.jsx                        # Root: auth gate → LoginPage or ChatPage
│   ├── index.js                       # ReactDOM + Redux Provider
│   └── index.css                      # Tailwind directives
├── .env.example                       # API key template (copy → .env)
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure API keys
cp .env.example .env
# Edit .env — add your Anthropic API key

# 3. Start development server
npm start
```

Use the sign-up page to create an account, then sign in with your API credentials.

---

## 🤖 AI Providers

### Currently Active — Anthropic Claude
Add to `.env`:
```
REACT_APP_ANTHROPIC_API_KEY=sk-ant-...
```

### Coming Soon — Meta LLaMA
When ready, uncomment one provider block in `.env`:

**Option A — Groq (fastest, free tier)**
```
REACT_APP_LLAMA_PROVIDER=groq
REACT_APP_GROQ_API_KEY=gsk_...
```

**Option B — Together AI**
```
REACT_APP_LLAMA_PROVIDER=together
REACT_APP_TOGETHER_API_KEY=...
```

**Option C — Ollama (local, fully private)**
```
REACT_APP_LLAMA_PROVIDER=ollama
REACT_APP_OLLAMA_BASE_URL=http://localhost:11434
```

No code changes needed — `aiService.js` auto-routes by model provider.

---

## ✨ Features

| Feature | Component |
|---|---|
| Login / Logout | `auth/LoginPage.jsx` + `authSlice.js` |
| Dark / Light mode | `uiSlice.js` + `useTheme.js` |
| Collapsible sidebar | `layout/Sidebar.jsx` + `uiSlice.js` |
| New chat + history | `chatSlice.js` + `layout/Sidebar.jsx` |
| Message bubbles | `chat/MessageBubble.jsx` |
| Thinking animation | `ui/ThinkingDots.jsx` |
| + (Plus) menu | `chat/PlusMenu.jsx` |
| Screenshot attach | `chat/PlusMenu.jsx` → `ChatInput.jsx` |
| File attach | `chat/PlusMenu.jsx` → `ChatInput.jsx` |
| Mic (Speech) | `hooks/useSpeech.js` + `ChatInput.jsx` |
| Model dropdown | `chat/ModelDropdown.jsx` |
| Submit button | `chat/ChatInput.jsx` |
| AI routing | `utils/aiService.js` |

---

## 🛠 Tech Stack

- **React 18** — UI
- **Redux Toolkit** — global state (auth, chat, ui)
- **Tailwind CSS 3** — utility styling
- **Anthropic API** — Claude models
- **LLaMA (Groq/Together/Ollama)** — coming soon
- **Web Speech API** — mic input (browser native)

