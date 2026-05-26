import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveChat, selectLoading } from '../../store/slices/chatSlice';
import MessageBubble from './MessageBubble';
import ThinkingDots from '../ui/ThinkingDots';
import { BotAvatar } from '../ui/Avatar';
import { useTheme } from '../../hooks/useTheme';

export default function MessageList() {
  const activeChat = useSelector(selectActiveChat);
  const loading    = useSelector(selectLoading);
  const { text, muted, msgBot } = useTheme();
  const bottomRef  = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeChat?.messages, loading]);

  const isEmpty = !activeChat || activeChat.messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto py-5">
      {isEmpty && (
        <div className="flex h-full flex-col items-center justify-center gap-3 opacity-60">
          <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" stroke="white" strokeWidth="2"/><circle cx="10" cy="12.5" r="2" fill="white"/><circle cx="18" cy="12.5" r="2" fill="white"/><path d="M10 18c1.2 1.5 6.8 1.5 8 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <p className={`font-display text-lg font-semibold ${text}`}>How can I help you?</p>
          <p className={`text-sm ${muted}`}>Start a conversation below</p>
        </div>
      )}

      <div className="mx-auto w-full max-w-[820px]">
        {activeChat?.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg}/>
        ))}
        {loading && (
          <div className="flex gap-3 px-5 py-2 animate-fadeUp">
            <BotAvatar/>
            <div className={`rounded-[16px_16px_16px_4px] px-3.5 py-2.5 ${msgBot}`}>
              <ThinkingDots/>
            </div>
          </div>
        )}
      </div>
      <div ref={bottomRef}/>
    </div>
  );
}
