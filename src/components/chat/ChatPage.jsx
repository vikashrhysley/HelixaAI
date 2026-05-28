import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, selectActiveChat, selectError, setConversationHistory } from '../../store/slices/chatSlice';
import { selectAccessToken } from '../../store/slices/authSlice';
import { selectSidebarOpen } from '../../store/slices/uiSlice';
import { getConversation, listConversations } from '../../utils/chatService';
import Sidebar    from '../layout/Sidebar';
import Header     from '../layout/Header';
import MessageList from '../chat/MessageList';
import ChatInput   from '../chat/ChatInput';
import { useTheme } from '../../hooks/useTheme';

export default function ChatPage() {
  const dispatch = useDispatch();
  const { dark, bg, sidebar, border, text, muted, hover } = useTheme();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const activeChat = useSelector(selectActiveChat);
  const error = useSelector(selectError);
  const accessToken = useSelector(selectAccessToken);
  const hasUserMessages = activeChat?.messages?.some((message) => message.role === 'user');

  useEffect(() => {
    if (!accessToken) return undefined;

    let isActive = true;
    listConversations(accessToken)
      .then(async (conversations) => {
        if (!isActive) return;
        const conversationDetails = await Promise.all(
          conversations.map((conversation) => (
            getConversation(accessToken, conversation.id).catch((err) => {
              console.warn('Unable to load conversation:', err.message);
              return null;
            })
          ))
        );

        if (isActive) dispatch(setConversationHistory(conversationDetails.filter(Boolean)));
      })
      .catch((err) => {
        console.warn('Unable to load chat history:', err.message);
      });

    return () => {
      isActive = false;
    };
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (!error) return undefined;

    const timer = setTimeout(() => {
      dispatch(clearError());
    }, 5200);

    return () => clearTimeout(timer);
  }, [dispatch, error]);

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${bg}`}>
      <div className={`shrink-0 overflow-hidden border-r transition-[width,min-width] duration-200 ease-in-out ${sidebar} ${border} ${sidebarOpen ? 'w-[260px] min-w-[260px]' : 'w-[52px] min-w-[52px]'}`}>
        <Sidebar collapsed={!sidebarOpen}/>
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Header/>
        {error && (
          <div className="pointer-events-none absolute right-5 top-[72px] z-[80] w-[min(360px,calc(100%-40px))] animate-fadeUp">
            <div className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_18px_48px_rgba(16,16,32,0.18)] ${dark ? 'border-red-400/20 bg-[#323237]/95' : 'border-red-100 bg-white/95'} backdrop-blur`}>
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="7" x2="12" y2="13"/><circle cx="12" cy="17" r="1"/></svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${text}`}>Model response failed</p>
                <p className={`mt-0.5 text-[13px] leading-5 ${muted}`}>{error}</p>
              </div>
              <button type="button" onClick={() => dispatch(clearError())} className={`-mr-1 mt-0.5 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent ${muted} ${hover}`} aria-label="Close error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        )}
        {hasUserMessages ? (
          <>
            <MessageList/>
            <ChatInput/>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center overflow-y-auto px-5 py-10">
            <div className="flex w-full max-w-[820px] -translate-y-7 flex-col items-center gap-[22px]">
              <div className="flex flex-col items-center gap-3 opacity-80">
                <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
                  <svg width="32" height="32" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" stroke="white" strokeWidth="2"/><circle cx="10" cy="12.5" r="2" fill="white"/><circle cx="18" cy="12.5" r="2" fill="white"/><path d="M10 18c1.2 1.5 6.8 1.5 8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <p className={`font-display text-[28px] font-bold leading-[1.15] ${text}`}>How can I help you?</p>
                <p className={`text-sm ${muted}`}>Start a conversation below</p>
              </div>
              <ChatInput centered/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
