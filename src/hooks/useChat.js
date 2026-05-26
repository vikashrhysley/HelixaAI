import { useDispatch, useSelector } from 'react-redux';
import {
  addUserMessage, addAssistantMessage, setError,
  selectActiveChat, selectLoading,
} from '../store/slices/chatSlice';
import { selectModel } from '../store/slices/uiSlice';
import { sendMessage } from '../utils/aiService';

export function useChat() {
  const dispatch    = useDispatch();
  const activeChat  = useSelector(selectActiveChat);
  const loading     = useSelector(selectLoading);
  const modelId     = useSelector(selectModel);

  const send = async (content, attachments = []) => {
    if (!content.trim() && attachments.length === 0) return;

    dispatch(addUserMessage({ content, attachments }));

    // Build history for the API (text only; files shown as note)
    const history = [
      ...(activeChat?.messages ?? []),
      { role: 'user', content: content || '(file attached)' },
    ].map((m) => ({ role: m.role, content: m.content }));

    try {
      const reply = await sendMessage(modelId, history);
      dispatch(addAssistantMessage(reply));
    } catch (err) {
      dispatch(addAssistantMessage(`⚠️ ${err.message}`));
      dispatch(setError(err.message));
    }
  };

  return { send, loading, activeChat };
}
