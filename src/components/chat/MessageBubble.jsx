import { Avatar, BotAvatar } from '../ui/Avatar';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { selectUser } from '../../store/slices/authSlice';
import { useTheme } from '../../hooks/useTheme';
import { formatTime } from '../../utils/helpers';

export default function MessageBubble({ message }) {
  const user = useSelector(selectUser);
  const { text, muted, msgBot } = useTheme();
  const isUser = message.role === 'user';
  const content = message.content || '';

  return (
    <div className={`flex items-start gap-3 px-5 py-2 animate-fadeUp ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {isUser ? <Avatar name={user?.name ?? 'You'}/> : <BotAvatar/>}
      <div className={`flex flex-col gap-1 ${isUser ? 'max-w-[72%] items-end' : 'max-w-[min(760px,calc(100%-56px))] flex-1 items-start'}`}>
        {/* Attachment chips */}
        {message.attachments?.map((a, i) => (
          <div key={i} className={`mb-0.5 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-[5px] text-[12.5px] ${msgBot} ${text}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            {a.name}
          </div>
        ))}
        {/* Bubble */}
        {isUser ? (
          <div className="whitespace-pre-wrap break-words rounded-[16px_16px_4px_16px] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] px-3.5 py-2.5 text-[14.5px] leading-[1.65] text-white">
            {content}
          </div>
        ) : (
          <div className={`w-full break-words rounded-[16px_16px_16px_4px] px-4 py-3 text-[15px] leading-7 ${msgBot} ${text}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
                ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
                li: ({ children }) => <li className="pl-1">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                code: ({ children }) => <code className="rounded bg-black/10 px-1 py-0.5 text-[13px]">{children}</code>,
                pre: ({ children }) => <pre className="mb-3 overflow-x-auto rounded-xl bg-black/10 p-3 text-[13px] leading-6 last:mb-0">{children}</pre>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
        <span className={`text-[11.5px] ${muted}`}>{formatTime(message.ts)}</span>
      </div>
    </div>
  );
}
