import { useState } from 'react';
import { api } from '../utils/api';

let nextMessageId = 1;

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async () => {
    const query = input.trim();
    if (!query || loading) return;

    setMessages((prev) => [...prev, { id: nextMessageId++, role: 'user', content: query }]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const data = await api.post('/chat/ask', { query, top_k: 3 });
      setMessages((prev) => [
        ...prev,
        { id: nextMessageId++, role: 'bot', content: data.answer, sources: data.sources || [] },
      ]);
    } catch (err) {
      setError(err.message || '답변을 가져오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { messages, input, setInput, loading, error, sendMessage };
}
