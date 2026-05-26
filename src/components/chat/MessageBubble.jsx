import { Avatar, BotAvatar } from '../ui/Avatar';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { useTheme } from '../../hooks/useTheme';
import { formatTime } from '../../utils/helpers';

export default function MessageBubble({ message }) {
  const user = useSelector(selectUser);
  const { text, muted, msgBot } = useTheme();
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 px-5 py-2 animate-fadeUp ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {isUser ? <Avatar name={user?.name ?? 'You'}/> : <BotAvatar/>}
      <div className={`flex max-w-[72%] flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Attachment chips */}
        {message.attachments?.map((a, i) => (
          <div key={i} className={`mb-0.5 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-[5px] text-[12.5px] ${msgBot} ${text}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            {a.name}
          </div>
        ))}
        {/* Bubble */}
        <div className={`whitespace-pre-wrap break-words px-3.5 py-2.5 text-[14.5px] leading-[1.65] ${isUser ? 'rounded-[16px_16px_4px_16px] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white' : `rounded-[16px_16px_16px_4px] ${msgBot} ${text}`}`}>
          {message.content}
        </div>
        <span className={`text-[11.5px] ${muted}`}>{formatTime(message.ts)}</span>
      </div>
    </div>
  );
}
