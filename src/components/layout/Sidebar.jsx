import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { newChat, setActiveChat, setConversationMessages, deleteChat, selectChats, selectActiveChatId } from '../../store/slices/chatSlice';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import { logout, selectAccessToken, selectUser } from '../../store/slices/authSlice';
import { logoutUser } from '../../utils/authService';
import { getConversation } from '../../utils/chatService';
import { Avatar } from '../ui/Avatar';
import IconButton from '../ui/IconButton';
import { useTheme } from '../../hooks/useTheme';

function LogoMark({ size = 30 }) {
  return (
    <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]" style={{ width: size, height: size }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/><circle cx="9" cy="10.5" r="1.5" fill="white"/><circle cx="15" cy="10.5" r="1.5" fill="white"/><path d="M9 15c.8 1.2 5.2 1.2 6 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
    </div>
  );
}

export default function Sidebar({ collapsed = false }) {
  const dispatch = useDispatch();
  const chats = useSelector(selectChats);
  const activeId = useSelector(selectActiveChatId);
  const user = useSelector(selectUser);
  const accessToken = useSelector(selectAccessToken);
  const [loggingOut, setLoggingOut] = useState(false);
  const { dark, sidebar, border, text, muted, hover } = useTheme();
  const activeBg = dark ? 'bg-[#38383E]' : 'bg-[#e8e8ff]';
  const hoverText = dark ? 'hover:text-[#e8e8f0]' : 'hover:text-[#1a1a2e]';
  const LogoutIcon = () => (
    loggingOut
      ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current"/>
      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  );
  const handleSelectChat = async (chat) => {
    dispatch(setActiveChat(chat.id));

    if (!chat.conversationId || chat.historyLoaded || !accessToken) return;

    try {
      const conversation = await getConversation(accessToken, chat.conversationId);
      dispatch(setConversationMessages(conversation));
    } catch (err) {
      console.warn('Unable to load conversation:', err.message);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await logoutUser(accessToken);
    } catch (err) {
      console.warn('Logout API failed:', err.message);
    } finally {
      dispatch(logout());
    }
  };

  if (collapsed) {
    return (
      <div className={`flex h-full flex-col items-center px-1.5 py-3 ${sidebar}`}>
        <div className="mb-2" title="HelixtaAI">
          <LogoMark size={32}/>
        </div>

        <IconButton onClick={() => dispatch(setSidebarOpen(true))} title="Open sidebar" className="h-9 w-9">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </IconButton>

        <IconButton onClick={() => dispatch(newChat())} title="New chat" className="mt-1.5 h-9 w-9">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
        </IconButton>

        <div className="flex-1"/>

        <div className={`flex w-full flex-col items-center gap-1 border-t pt-2.5 ${border}`}>
          <div title={user?.name ?? 'User'}>
            <Avatar name={user?.name ?? 'User'} size={30}/>
          </div>
          <IconButton title={loggingOut ? 'Logging out...' : 'Logout'} onClick={handleLogout} className="h-9 w-9">
            <LogoutIcon/>
          </IconButton>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-full flex-col ${sidebar}`}>
      <div className="flex items-center gap-2 px-3 pb-2 pt-4">
        <div className="flex flex-1 items-center gap-2">
          <LogoMark/>
          <span className={`font-display text-base font-bold ${text}`}>HelixtaAI</span>
        </div>
        <IconButton onClick={() => dispatch(setSidebarOpen(false))} title="Collapse sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </IconButton>
      </div>

      <div className="px-3 py-2">
        <button onClick={() => dispatch(newChat())} className={`flex w-full cursor-pointer items-center gap-2 rounded-[10px] border bg-transparent px-3.5 py-2.5 font-sans text-sm font-medium transition-colors ${border} ${text} ${hover}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <p className={`px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${muted}`}>Conversations</p>
        {chats.map((c) => {
          const isActive = c.id === activeId;
          return (
            <div
              key={c.id}
              onClick={() => handleSelectChat(c)}
              className={`flex cursor-pointer items-center justify-between gap-2.5 rounded-[10px] px-3 py-[9px] text-[13.5px] transition-colors ${isActive ? `${activeBg} text-[#6366f1]` : `${text} ${hover}`}`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                <svg className="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span className="flex-1 truncate">{c.title}</span>
              </div>
              <IconButton className="shrink-0 p-1 opacity-60" onClick={(e) => { e.stopPropagation(); dispatch(deleteChat(c.id)); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              </IconButton>
            </div>
          );
        })}
      </div>

      <div className={`border-t p-3 ${border}`}>
        <div className="flex items-center gap-2.5 rounded-[10px] px-3 py-2">
          <Avatar name={user?.name ?? 'User'} size={32}/>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className={`truncate text-[13.5px] font-medium ${text}`}>{user?.name}</p>
            <p className={`truncate text-xs ${muted}`}>{user?.email}</p>
          </div>
          <IconButton title={loggingOut ? 'Logging out...' : 'Logout'} onClick={handleLogout}>
            <LogoutIcon/>
          </IconButton>
        </div>
      </div>
    </div>
  );
}
