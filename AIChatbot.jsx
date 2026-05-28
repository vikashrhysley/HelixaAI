import { useState, useRef, useEffect, useCallback } from "react";

const MODELS = [
  { id: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
  { id: "claude-opus-4-20250514", label: "Claude Opus 4" },
  { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" },
  { id: "gpt-4o", label: "GPT-4o" },
  { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
];

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Avatar({ name, size = 32 }) {
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 600, color: "#fff", flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif"
    }}>{initials}</div>
  );
}

function BotAvatar({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0
    }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="1.5"/>
        <circle cx="7" cy="9" r="1.5" fill="white"/>
        <circle cx="13" cy="9" r="1.5" fill="white"/>
        <path d="M7 13c.8 1 5.2 1 6 0" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "#6366f1",
          animation: "bounce 1.2s infinite",
          animationDelay: `${i * 0.2}s`
        }}/>
      ))}
    </div>
  );
}

// LOGIN PAGE
function LoginPage({ onLogin, dark }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const bg = dark ? "#0f0f13" : "#f8f7ff";
  const card = dark ? "#1a1a24" : "#ffffff";
  const text = dark ? "#e8e8f0" : "#1a1a2e";
  const muted = dark ? "#8888a8" : "#6b6b8a";
  const border = dark ? "#2e2e42" : "#e2e2f0";
  const inputBg = dark ? "#12121a" : "#f4f4fc";
  const accent = "#6366f1";

  const handle = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (email.trim() && password.trim()) {
      onLogin({ email, name: email.split("@")[0] || "User" });
    } else {
      setError("Enter your email and password.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", padding: "1rem"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-input { width:100%; padding:11px 14px; border-radius:10px; border:1.5px solid ${border}; background:${inputBg}; color:${text}; font-size:14.5px; font-family:inherit; outline:none; transition:border 0.2s; }
        .login-input:focus { border-color:${accent}; }
        .login-input::placeholder { color:${muted}; }
        .login-btn { width:100%; padding:12px; border-radius:10px; background:${accent}; color:#fff; font-size:15px; font-weight:600; border:none; cursor:pointer; font-family:inherit; transition:opacity 0.2s,transform 0.1s; }
        .login-btn:hover { opacity:0.9; }
        .login-btn:active { transform:scale(0.98); }
        .login-btn:disabled { opacity:0.6; cursor:default; }
      `}</style>
      <div style={{
        width: "100%", maxWidth: 420,
        background: card, borderRadius: 20,
        border: `1.5px solid ${border}`, padding: "2.5rem 2rem",
        animation: "fadeIn 0.4s ease"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12" stroke="white" strokeWidth="2"/>
              <circle cx="10" cy="12.5" r="2" fill="white"/>
              <circle cx="18" cy="12.5" r="2" fill="white"/>
              <path d="M10 18c1.2 1.5 6.8 1.5 8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: text, fontFamily: "'Space Grotesk', sans-serif" }}>Welcome to HelixtaAI</h1>
          <p style={{ fontSize: 14, color: muted, marginTop: 6 }}>Sign in to start chatting</p>
        </div>
        <form onSubmit={handle} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: muted, display: "block", marginBottom: 6 }}>Email</label>
            <input className="login-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required/>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: muted, display: "block", marginBottom: 6 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input className="login-input" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 44 }}/>
              <button type="button" onClick={() => setShowPass(p => !p)} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: muted, padding: 2
              }}>
                {showPass ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>
          {error && <p style={{ color: "#f87171", fontSize: 13, background: "#450a0a22", borderRadius: 8, padding: "8px 12px" }}>{error}</p>}
          <button className="login-btn" type="submit" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }}/>
                Signing in...
              </span>
            ) : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

// MAIN CHAT APP
export default function AIChatApp() {
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState([
    { id: "c1", title: "Getting started", messages: [{ id: "m0", role: "assistant", content: "Hello! I'm HelixtaAI, your intelligent assistant. How can I help you today? ✨", ts: Date.now() - 60000 }], ts: Date.now() - 60000 },
  ]);
  const [activeChatId, setActiveChatId] = useState("c1");
  const [input, setInput] = useState("");
  const [model, setModel] = useState(MODELS[0].id);
  const [loading, setLoading] = useState(false);
  const [showPlus, setShowPlus] = useState(false);
  const [showModelDrop, setShowModelDrop] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const ssRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  const bg = dark ? "#0f0f13" : "#f8f7ff";
  const sidebar = dark ? "#13131a" : "#f0f0fa";
  const chat = dark ? "#0f0f13" : "#ffffff";
  const text = dark ? "#e8e8f0" : "#1a1a2e";
  const muted = dark ? "#7878a0" : "#7878a0";
  const border = dark ? "#22222e" : "#e0e0f0";
  const inputBg = dark ? "#1a1a26" : "#f4f4fc";
  const msgUserBg = "linear-gradient(135deg, #6366f1, #8b5cf6)";
  const msgBotBg = dark ? "#1e1e2e" : "#f3f3ff";
  const hoverBg = dark ? "#1c1c28" : "#eeeeff";
  const accent = "#6366f1";

  const activeChat = chats.find(c => c.id === activeChatId);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeChat?.messages, loading]);

  const newChat = () => {
    const id = generateId();
    const nc = { id, title: "New chat", messages: [], ts: Date.now() };
    setChats(prev => [nc, ...prev]);
    setActiveChatId(id);
    setInput("");
    setAttachments([]);
  };

  const deleteChat = (id) => {
    setChats(prev => {
      const next = prev.filter(c => c.id !== id);
      if (activeChatId === id && next.length > 0) setActiveChatId(next[0].id);
      return next;
    });
  };

  const sendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;
    const userMsg = {
      id: generateId(), role: "user",
      content: input.trim(),
      attachments: [...attachments],
      ts: Date.now()
    };
    setChats(prev => prev.map(c => {
      if (c.id !== activeChatId) return c;
      const msgs = [...c.messages, userMsg];
      return { ...c, messages: msgs, title: msgs.length === 1 && input.trim() ? input.trim().slice(0, 40) : c.title };
    }));
    setInput("");
    setAttachments([]);
    setLoading(true);
    setShowPlus(false);

    const msgHistory = [...(activeChat?.messages || []), userMsg].map(m => ({
      role: m.role,
      content: m.content || "(file attached)"
    }));

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model.startsWith("claude") ? model : "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are HelixtaAI, a helpful, concise, and friendly AI assistant. Respond naturally and helpfully.",
          messages: msgHistory
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I couldn't generate a response.";
      const botMsg = { id: generateId(), role: "assistant", content: reply, ts: Date.now() };
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, botMsg] } : c));
    } catch {
      const errMsg = { id: generateId(), role: "assistant", content: "Sorry, there was an error connecting to the AI. Please try again.", ts: Date.now() };
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, errMsg] } : c));
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleFile = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files.map(f => ({ name: f.name, type: f.type, size: f.size }))]);
    e.target.value = "";
  };

  const takeScreenshot = async () => {
    const note = { id: generateId(), role: "user", content: "[Screenshot captured — screen content attached]", attachments: [{ name: "screenshot.png", type: "image/png", size: 0 }], ts: Date.now() };
    setChats(prev => prev.map(c => c.id !== activeChatId ? c : { ...c, messages: [...c.messages, note] }));
    setShowPlus(false);
  };

  const toggleMic = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition not supported in this browser."); return; }
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.onresult = (e) => { setInput(prev => prev + e.results[0][0].transcript + " "); };
    r.onend = () => setListening(false);
    r.start();
    recognitionRef.current = r;
    setListening(true);
  };

  if (!user) return <LoginPage onLogin={setUser} dark={dark}/>;

  const modelLabel = MODELS.find(m => m.id === model)?.label || model;

  return (
    <div style={{ display: "flex", height: "100vh", background: bg, fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${dark ? "#2e2e42" : "#d0d0e8"}; border-radius: 99px; }
        .sidebar-item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:10px; cursor:pointer; transition:background 0.15s; font-size:13.5px; color:${text}; }
        .sidebar-item:hover { background:${hoverBg}; }
        .sidebar-item.active { background:${dark ? "#22223a" : "#e8e8ff"}; color:${accent}; }
        .icon-btn { background:none; border:none; cursor:pointer; color:${muted}; display:flex; align-items:center; justify-content:center; border-radius:8px; padding:6px; transition:background 0.15s,color 0.15s; }
        .icon-btn:hover { background:${hoverBg}; color:${text}; }
        .tool-btn { background:none; border:none; cursor:pointer; display:flex; align-items:center; gap:7px; padding:9px 14px; border-radius:10px; font-size:13.5px; font-family:inherit; color:${text}; transition:background 0.15s; width:100%; text-align:left; }
        .tool-btn:hover { background:${hoverBg}; }
        .model-opt { padding:9px 14px; font-size:13.5px; cursor:pointer; color:${text}; transition:background 0.15s; font-family:inherit; }
        .model-opt:hover { background:${hoverBg}; }
        textarea { resize:none; outline:none; border:none; background:transparent; font-family:inherit; font-size:14.5px; color:${text}; width:100%; line-height:1.6; }
        textarea::placeholder { color:${muted}; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? 260 : 0, minWidth: sidebarOpen ? 260 : 0,
        background: sidebar, borderRight: `1px solid ${border}`,
        display: "flex", flexDirection: "column",
        overflow: "hidden", transition: "width 0.25s ease, min-width 0.25s ease",
        flexShrink: 0
      }}>
        <div style={{ padding: "16px 12px 8px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/><circle cx="9" cy="10.5" r="1.5" fill="white"/><circle cx="15" cy="10.5" r="1.5" fill="white"/><path d="M9 15c.8 1.2 5.2 1.2 6 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: text }}>HelixtaAI</span>
          </div>
          <button className="icon-btn" onClick={() => setSidebarOpen(false)} title="Collapse sidebar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        </div>

        <div style={{ padding: "8px 12px" }}>
          <button onClick={newChat} style={{
            width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${border}`,
            background: "none", color: text, fontSize: 14, fontFamily: "inherit", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8, fontWeight: 500, transition: "background 0.15s"
          }} onMouseEnter={e => e.currentTarget.style.background = hoverBg} onMouseLeave={e => e.currentTarget.style.background = "none"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            New chat
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 8px 8px" }}>Conversations</p>
          {chats.map(c => (
            <div key={c.id} className={`sidebar-item ${c.id === activeChatId ? "active" : ""}`}
              onClick={() => setActiveChatId(c.id)}
              style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, overflow: "hidden" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{c.title}</span>
              </div>
              <button className="icon-btn" style={{ padding: 4, opacity: 0.6, flexShrink: 0 }} onClick={e => { e.stopPropagation(); deleteChat(c.id); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              </button>
            </div>
          ))}
        </div>

        {/* LOGOUT */}
        <div style={{ padding: "12px", borderTop: `1px solid ${border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10 }}>
            <Avatar name={user.name} size={32}/>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <p style={{ fontSize: 13.5, fontWeight: 500, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
              <p style={{ fontSize: 12, color: muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
            </div>
            <button className="icon-btn" title="Logout" onClick={() => setUser(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* HEADER */}
        <div style={{ height: 56, padding: "0 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${border}`, background: chat, flexShrink: 0 }}>
          {!sidebarOpen && (
            <button className="icon-btn" onClick={() => setSidebarOpen(true)} title="Open sidebar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          )}
          <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 15, color: text, flex: 1 }}>
            {activeChat?.title || "New chat"}
          </span>
          <button className="icon-btn" onClick={() => setDark(d => !d)} title="Toggle theme">
            {dark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
        </div>

        {/* MESSAGES */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 0" }}>
          {(!activeChat || activeChat.messages.length === 0) && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, opacity: 0.6 }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="32" height="32" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" stroke="white" strokeWidth="2"/><circle cx="10" cy="12.5" r="2" fill="white"/><circle cx="18" cy="12.5" r="2" fill="white"/><path d="M10 18c1.2 1.5 6.8 1.5 8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <p style={{ fontSize: 18, fontWeight: 600, color: text, fontFamily: "'Space Grotesk'" }}>How can I help you?</p>
              <p style={{ fontSize: 14, color: muted }}>Start a conversation below</p>
            </div>
          )}
          {activeChat?.messages.map((msg, i) => (
            <div key={msg.id} style={{
              display: "flex", gap: 12, padding: "8px 20px", maxWidth: 820, margin: "0 auto", width: "100%",
              animation: "fadeUp 0.2s ease", flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-start"
            }}>
              {msg.role === "assistant" ? <BotAvatar/> : <Avatar name={user.name}/>}
              <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: 4, alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.attachments?.map((a, ai) => (
                  <div key={ai} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: dark ? "#1e1e2e" : "#e8e8ff", borderRadius: 8,
                    padding: "5px 10px", fontSize: 12.5, color: text, marginBottom: 4
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    {a.name}
                  </div>
                ))}
                <div style={{
                  padding: "10px 14px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.role === "user" ? msgUserBg : msgBotBg,
                  color: msg.role === "user" ? "#fff" : text,
                  fontSize: 14.5, lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word"
                }}>
                  {msg.content}
                </div>
                <span style={{ fontSize: 11.5, color: muted }}>{formatTime(msg.ts)}</span>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 12, padding: "8px 20px", maxWidth: 820, margin: "0 auto", width: "100%", animation: "fadeUp 0.2s ease" }}>
              <BotAvatar/>
              <div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: msgBotBg }}>
                <ThinkingDots/>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* INPUT */}
        <div style={{ padding: "12px 20px 16px", background: chat, borderTop: `1px solid ${border}` }}>
          {attachments.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {attachments.map((a, i) => (
                <div key={i} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: dark ? "#1e1e2e" : "#e8e8ff",
                  borderRadius: 8, padding: "4px 10px", fontSize: 12.5, color: text
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  {a.name}
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: muted, padding: 0, lineHeight: 1 }} onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}>×</button>
                </div>
              ))}
            </div>
          )}

          <div style={{
            background: inputBg, border: `1.5px solid ${border}`, borderRadius: 14,
            padding: "10px 10px 10px 14px", display: "flex", flexDirection: "column", gap: 8
          }}>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px"; }}
              onKeyDown={handleKey}
              placeholder="Message HelixtaAI..."
              style={{ maxHeight: 180 }}
            />

            {/* TOOLBAR — single line */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {/* PLUS BUTTON */}
              <div style={{ position: "relative" }}>
                <button className="icon-btn" onClick={() => setShowPlus(p => !p)} title="Attachments" style={{ color: showPlus ? accent : muted }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14"/></svg>
                </button>
                {showPlus && (
                  <div style={{
                    position: "absolute", bottom: 38, left: 0,
                    background: dark ? "#1e1e2e" : "#fff",
                    border: `1px solid ${border}`, borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.22)", zIndex: 100, overflow: "hidden",
                    minWidth: 190, animation: "fadeUp 0.15s ease"
                  }}>
                    <button className="tool-btn" onClick={takeScreenshot}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      Take screenshot
                    </button>
                    <button className="tool-btn" onClick={() => { fileInputRef.current?.click(); setShowPlus(false); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      Add file
                    </button>
                    <input type="file" ref={fileInputRef} style={{ display: "none" }} multiple onChange={handleFile}/>
                  </div>
                )}
              </div>

              {/* MIC */}
              <button className="icon-btn" onClick={toggleMic} title={listening ? "Stop recording" : "Voice input"} style={{ color: listening ? "#ef4444" : muted, animation: listening ? "pulse 1s infinite" : "none" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="2" width="6" height="12" rx="3"/>
                  <path d="M5 10a7 7 0 0 0 14 0M12 19v3M9 22h6"/>
                </svg>
              </button>

              {/* SPACER */}
              <div style={{ flex: 1 }}/>

              {/* MODEL DROPDOWN */}
              <div style={{ position: "relative" }}>
                <button onClick={() => setShowModelDrop(p => !p)} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: dark ? "#22223a" : "#e8e8ff",
                  border: "none", borderRadius: 8, padding: "5px 10px",
                  fontSize: 12.5, color: text, cursor: "pointer", fontFamily: "inherit",
                  transition: "background 0.15s"
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                  {modelLabel}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: showModelDrop ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {showModelDrop && (
                  <div style={{
                    position: "absolute", bottom: 36, right: 0,
                    background: dark ? "#1e1e2e" : "#fff",
                    border: `1px solid ${border}`, borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.22)", zIndex: 100, overflow: "hidden",
                    minWidth: 200, animation: "fadeUp 0.15s ease"
                  }}>
                    {MODELS.map(m => (
                      <div key={m.id} className="model-opt" onClick={() => { setModel(m.id); setShowModelDrop(false); }} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {m.id === model && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
                        <span style={{ marginLeft: m.id === model ? 0 : 22 }}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SEND */}
              <button onClick={sendMessage} disabled={loading || (!input.trim() && attachments.length === 0)} style={{
                width: 36, height: 36, borderRadius: 10, border: "none",
                background: (input.trim() || attachments.length > 0) && !loading ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : (dark ? "#22222e" : "#e0e0f0"),
                cursor: (input.trim() || attachments.length > 0) && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s, transform 0.1s", flexShrink: 0
              }} onMouseDown={e => { if (!e.currentTarget.disabled) e.currentTarget.style.transform = "scale(0.94)"; }}
                 onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={(input.trim() || attachments.length > 0) && !loading ? "#fff" : muted} strokeWidth="2.2">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
          <p style={{ fontSize: 11.5, color: muted, textAlign: "center", marginTop: 8 }}>HelixtaAI can make mistakes. Consider verifying important info.</p>
        </div>
      </div>

      {/* CLICK OUTSIDE to close dropdowns */}
      {(showPlus || showModelDrop) && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => { setShowPlus(false); setShowModelDrop(false); }}/>
      )}
    </div>
  );
}
