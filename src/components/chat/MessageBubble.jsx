import { Avatar, BotAvatar } from '../ui/Avatar';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { selectUser } from '../../store/slices/authSlice';
import { updateMessageContent } from '../../store/slices/chatSlice';
import { useTheme } from '../../hooks/useTheme';
import { formatTime } from '../../utils/helpers';

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

export default function MessageBubble({ message }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { text, muted, msgBot, input: inputClass, border, hover } = useTheme();
  const isUser = message.role === 'user';
  const content = message.content || '';
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content.trim()) return;
    await copyText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const startEdit = () => {
    setDraft(content);
    setEditing(true);
  };

  const saveEdit = () => {
    const value = draft.trim();
    if (!value) return;
    dispatch(updateMessageContent({ id: message.id, content: value }));
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft(content);
    setEditing(false);
  };

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
          editing ? (
            <div className={`w-[min(520px,72vw)] rounded-[16px_16px_4px_16px] border p-2 ${inputClass} ${border}`}>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className={`min-h-[88px] w-full resize-y border-0 bg-transparent p-1 font-sans text-[14.5px] leading-[1.65] outline-none ${text}`}
                autoFocus
              />
              <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={cancelEdit} className={`cursor-pointer rounded-lg border px-3 py-1.5 text-[12.5px] font-medium ${border} ${text} ${hover}`}>
                  Cancel
                </button>
                <button type="button" onClick={saveEdit} disabled={!draft.trim()} className="cursor-pointer rounded-lg border-0 bg-[#6366f1] px-3 py-1.5 text-[12.5px] font-semibold text-white disabled:cursor-default disabled:opacity-50">
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap break-words rounded-[16px_16px_4px_16px] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] px-3.5 py-2.5 text-[14.5px] leading-[1.65] text-white">
              {content}
            </div>
          )
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
        <div className={`flex items-center gap-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className={`text-[11.5px] ${muted}`}>{formatTime(message.ts)}</span>
          {!editing && (
            <>
              {isUser && (
                <button type="button" onClick={startEdit} className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent ${muted} ${hover}`} title="Edit question" aria-label="Edit question">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </button>
              )}
              <button type="button" onClick={handleCopy} className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent ${copied ? 'text-emerald-500' : muted} ${hover}`} title={copied ? 'Copied' : 'Copy'} aria-label={copied ? 'Copied' : 'Copy message'}>
                {copied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
