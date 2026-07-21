import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bot, Home, Send } from 'lucide-react';
import useChat from '../../hooks/useChat';
import useBookmarks from '../../hooks/useBookmarks';
import usePolicyDetail from '../../hooks/usePolicyDetail';
import PolicyCard from '../../Components/PolicyCard';
import PolicyDetailModal from '../../Components/PolicyDetailModal';

export default function ChatPage() {
  const { messages, input, setInput, loading, error, sendMessage } = useChat();
  const { isBookmarked, toggleBookmark, loading: bookmarksLoading } = useBookmarks();
  const { selectedPolicy, policyLoading, openPolicy, closePolicy } = usePolicyDetail();
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f6fa', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center gap-2 bg-white" style={{ padding: '20px 20px 16px' }}>
        <button onClick={() => navigate(-1)} className="bg-transparent border-none cursor-pointer p-0 flex items-center">
          <ChevronLeft size={24} color="#333" />
        </button>
        <p className="flex-1 text-[20px] font-bold text-gray-900">정책 챗봇</p>
        <button onClick={() => navigate('/')} className="bg-transparent border-none cursor-pointer p-0 flex items-center">
          <Home size={22} color="#333" />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 24px' }}>
        {messages.length === 0 && (
          <div className="flex gap-3 bg-blue-50 rounded-2xl" style={{ padding: '14px 16px' }}>
            <div className="w-[34px] h-[34px] rounded-full bg-blue-500 flex items-center justify-center shrink-0">
              <Bot size={18} color="#fff" />
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed">
              궁금한 지원금이나 상황을 자유롭게 물어보세요. 관련 정책 문서를 찾아 답변해드려요.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4" style={{ marginTop: messages.length > 0 ? 0 : 16 }}>
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === 'user' ? (
                <div className="flex justify-end">
                  <div
                    className="text-[14px] text-white"
                    style={{
                      maxWidth: '80%', padding: '10px 14px', borderRadius: '16px 16px 4px 16px',
                      background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', lineHeight: 1.5,
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="w-[28px] h-[28px] rounded-full bg-blue-500 flex items-center justify-center shrink-0" style={{ marginTop: 2 }}>
                    <Bot size={15} color="#fff" />
                  </div>
                  <div style={{ maxWidth: '85%' }}>
                    <div
                      className="text-[14px] text-gray-800"
                      style={{
                        padding: '10px 14px', borderRadius: '4px 16px 16px 16px',
                        backgroundColor: '#fff', lineHeight: 1.6, boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {message.content}
                    </div>

                    {message.sources?.length > 0 && (
                      <div className="flex flex-col gap-2" style={{ marginTop: 10 }}>
                        {message.sources.map((source) => (
                          <PolicyCard
                            key={source.plcyNo}
                            policy={source}
                            onOpen={openPolicy}
                            isBookmarked={isBookmarked(source.policy_id, source.is_bookmarked)}
                            onToggleBookmark={toggleBookmark}
                            bookmarkDisabled={bookmarksLoading}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2">
              <div className="w-[28px] h-[28px] rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <Bot size={15} color="#fff" />
              </div>
              <div
                className="text-[13px] text-gray-400"
                style={{ padding: '10px 14px', borderRadius: '4px 16px 16px 16px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
              >
                답변을 준비하고 있어요...
              </div>
            </div>
          )}

          {error && <p className="text-[13px] text-center" style={{ color: '#ef4444' }}>{error}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white border-t border-gray-100" style={{ padding: '12px 16px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="예: 청년 이사비 지원받고 싶어"
          style={{
            flex: 1, padding: '12px 16px', borderRadius: 999, border: '1.5px solid #e5e7eb',
            fontSize: 14, outline: 'none', backgroundColor: '#f9fafb',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="flex items-center justify-center shrink-0"
          style={{
            width: 42, height: 42, borderRadius: '50%', border: 'none',
            background: input.trim() && !loading ? 'linear-gradient(135deg, #60a5fa, #3b82f6)' : '#e5e7eb',
            cursor: input.trim() && !loading ? 'pointer' : 'default',
          }}
        >
          <Send size={18} color={input.trim() && !loading ? '#fff' : '#9ca3af'} />
        </button>
      </div>

      <PolicyDetailModal
        selectedPolicy={selectedPolicy}
        policyLoading={policyLoading}
        isBookmarked={isBookmarked(selectedPolicy?.policy_id, selectedPolicy?.is_bookmarked)}
        onToggleBookmark={toggleBookmark}
        bookmarkDisabled={bookmarksLoading}
        onClose={closePolicy}
      />
    </div>
  );
}
