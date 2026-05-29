import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addUserMessage,
  appendAssistantMessageChunk,
  finishAssistantMessage,
  removeMessage,
  setChatConversationId,
  setError,
  startAssistantMessage,
  selectActiveChat,
} from '../../store/slices/chatSlice';
import { selectAccessToken } from '../../store/slices/authSlice';
import { selectModel } from '../../store/slices/uiSlice';
import { startChat, streamChat } from '../../utils/chatService';
import { MODELS } from '../../constants/models';
import { useTheme } from '../../hooks/useTheme';
import { useSpeech } from '../../hooks/useSpeech';
import { generateId } from '../../utils/helpers';
import PlusMenu from './PlusMenu';
import ModelDropdown from './ModelDropdown';
import IconButton from '../ui/IconButton';

const STREAM_WORD_DELAY_MS = 22;
const splitForTyping = (value) => value.match(/\s+|[^\s]+/g) || [];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ChatInput({ centered = false }) {
  const dispatch = useDispatch();
  const activeChat = useSelector(selectActiveChat);
  const accessToken = useSelector(selectAccessToken);
  const modelId = useSelector(selectModel);
  const { chat, border, input: inputClass, text, muted } = useTheme();

  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const textareaRef = useRef(null);
  const streamControllerRef = useRef(null);
  const stopRequestedRef = useRef(false);

  const { listening, toggle: toggleMic } = useSpeech((textValue) =>
    setInput((prev) => prev + textValue)
  );

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
  };

  const send = async () => {
    if (!input.trim() && attachments.length === 0) return;
    const content = input.trim();
    const atts = [...attachments];

    setInput('');
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setLoading(true);
    setPlusOpen(false);
    stopRequestedRef.current = false;

    dispatch(addUserMessage({ content, attachments: atts }));

    let assistantMessageId = null;
    let responseReceived = false;
    let firstResponseTimer = null;
    const selectedModel = MODELS.find((model) => model.id === modelId);
    const modelLabel = selectedModel?.label || modelId;
    const timeoutMessage = `${modelLabel} is not responding right now. Please try again or choose another model.`;
    const controller = new AbortController();
    streamControllerRef.current = controller;

    try {
      if (!accessToken) {
        throw new Error('Your session has expired. Please log in again.');
      }

      let conversationId = activeChat?.conversationId;
      const chatId = activeChat?.id;

      if (!conversationId) {
        const conversation = await startChat(accessToken);
        conversationId = conversation.id;
        if (chatId) {
          dispatch(setChatConversationId({ chatId, conversationId }));
        }
      }

      assistantMessageId = generateId();
      dispatch(startAssistantMessage({ id: assistantMessageId }));
      firstResponseTimer = setTimeout(() => {
        controller.abort();
      }, 25000);

      await streamChat({
        accessToken,
        conversationId,
        message: content || '(file attached)',
        model: modelId,
        signal: controller.signal,
        onChunk: async (delta) => {
          if (delta) {
            responseReceived = true;
            if (firstResponseTimer) {
              clearTimeout(firstResponseTimer);
              firstResponseTimer = null;
            }
          }
          const pieces = splitForTyping(delta);
          for (const piece of pieces) {
            if (stopRequestedRef.current || controller.signal.aborted) {
              const abortError = new Error('Response stopped.');
              abortError.name = 'AbortError';
              throw abortError;
            }
            dispatch(appendAssistantMessageChunk({ id: assistantMessageId, delta: piece }));
            await wait(STREAM_WORD_DELAY_MS);
          }
        },
        onDone: () => {
          if (firstResponseTimer) {
            clearTimeout(firstResponseTimer);
            firstResponseTimer = null;
          }
          dispatch(finishAssistantMessage());
        },
      });

      if (!responseReceived) {
        throw new Error(`${modelLabel} did not return a response. Please try again or choose another model.`);
      }

      dispatch(finishAssistantMessage());
    } catch (err) {
      if (err.name === 'AbortError' && stopRequestedRef.current) {
        if (assistantMessageId && !responseReceived) {
          dispatch(removeMessage(assistantMessageId));
        }
        dispatch(finishAssistantMessage());
      } else {
        const message = err.name === 'AbortError' ? timeoutMessage : err.message;
        if (assistantMessageId) {
          dispatch(removeMessage(assistantMessageId));
          dispatch(finishAssistantMessage());
        }
        dispatch(setError(message));
      }
    } finally {
      if (firstResponseTimer) clearTimeout(firstResponseTimer);
      streamControllerRef.current = null;
      stopRequestedRef.current = false;
      setLoading(false);
    }
  };

  const stopResponse = () => {
    stopRequestedRef.current = true;
    streamControllerRef.current?.abort();
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const onFile = (files) =>
    setAttachments((prev) => [...prev, ...files.map((f) => ({ name: f.name, type: f.type }))]);

  const onScreenshot = () =>
    setAttachments((prev) => [...prev, { name: 'screenshot.png', type: 'image/png' }]);

  const canSend = (input.trim() || attachments.length > 0) && !loading;

  return (
    <div className={centered ? 'w-full px-5 py-0' : `border-t px-5 pb-4 pt-3 ${chat} ${border}`}>
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {attachments.map((a, i) => (
            <div key={i} className={`inline-flex items-center gap-[5px] rounded-lg px-2.5 py-1 text-[12.5px] ${inputClass} ${text}`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              {a.name}
              <button className={`cursor-pointer border-0 bg-transparent p-0 ${muted}`} onClick={() => setAttachments((p) => p.filter((_, j) => j !== i))}>x</button>
            </div>
          ))}
        </div>
      )}

      <div className={`flex flex-col gap-2 rounded-[14px] border px-2.5 pb-2.5 pt-2.5 pl-3.5 ${inputClass} ${border}`}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => { setInput(e.target.value); autoResize(); }}
          onKeyDown={onKey}
          placeholder="Message HelixtaAI..."
          className={`max-h-[180px] w-full resize-none border-0 bg-transparent font-sans text-[14.5px] leading-[1.6] outline-none placeholder:text-[#7878a0] ${text}`}
        />

        <div className="flex items-center gap-1">
          {/* <div className="relative">
            <IconButton onClick={() => setPlusOpen((p) => !p)} title="Attachments" active={plusOpen}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14"/></svg>
            </IconButton>
            <PlusMenu open={plusOpen} onClose={() => setPlusOpen(false)} onFile={onFile} onScreenshot={onScreenshot}/>
          </div> */}

          {/* <IconButton onClick={toggleMic} title={listening ? 'Stop' : 'Voice input'} danger={listening} className={listening ? 'animate-pulse2' : ''}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="2" width="6" height="12" rx="3"/>
              <path d="M5 10a7 7 0 0 0 14 0M12 19v3M9 22h6"/>
            </svg>
          </IconButton> */}

          <div className="flex-1"/>

          <ModelDropdown/>

          {loading ? (
            <button onClick={stopResponse} className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border-0 bg-[#ef4444] text-white transition-colors hover:bg-[#dc2626]" title="Stop response" aria-label="Stop response">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            </button>
          ) : (
            <button onClick={send} disabled={!canSend} className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border-0 transition-colors ${canSend ? 'cursor-pointer bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white' : `cursor-default ${inputClass} ${muted}`}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
