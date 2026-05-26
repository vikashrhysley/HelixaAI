import { useSelector } from 'react-redux';
import { selectActiveChat } from '../../store/slices/chatSlice';
import { selectSidebarOpen } from '../../store/slices/uiSlice';
import Sidebar    from '../layout/Sidebar';
import Header     from '../layout/Header';
import MessageList from '../chat/MessageList';
import ChatInput   from '../chat/ChatInput';
import { useTheme } from '../../hooks/useTheme';

export default function ChatPage() {
  const { bg, sidebar, border, text, muted } = useTheme();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const activeChat = useSelector(selectActiveChat);
  const hasUserMessages = activeChat?.messages?.some((message) => message.role === 'user');

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${bg}`}>
      <div className={`shrink-0 overflow-hidden border-r transition-[width,min-width] duration-200 ease-in-out ${sidebar} ${border} ${sidebarOpen ? 'w-[260px] min-w-[260px]' : 'w-[52px] min-w-[52px]'}`}>
        <Sidebar collapsed={!sidebarOpen}/>
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Header/>
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
