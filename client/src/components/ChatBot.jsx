import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

function generateSessionId() {
  return 'sess_' + Math.random().toString(36).slice(2) + Date.now();
}

const SESSION_ID = generateSessionId();

const WELCOME = {
  sender: 'bot',
  message: "👋 Hi! I'm the **IILMS Assistant**. I can help you with:\n• Finding internships\n• Application process\n• Profile & account\n• Complaints & support\n\nWhat would you like to know?",
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages(m => [...m, { sender: 'user', message: text }]);
    setLoading(true);
    try {
      const res = await api.post('/chat', { message: text, session_id: SESSION_ID });
      setMessages(m => [...m, { sender: 'bot', message: res.data.data.reply }]);
    } catch {
      setMessages(m => [...m, { sender: 'bot', message: "Sorry, I'm having trouble connecting. Please try again." }]);
    } finally { setLoading(false); }
  }

  function renderMessage(text) {
    // Simple markdown: **bold**, newlines
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  }

  const QUICK = ['How to apply?', 'Track application', 'Submit complaint', 'Update profile'];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full text-white text-2xl flex items-center justify-center shadow-lg transition-all hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', boxShadow: '0 4px 20px rgba(79,70,229,0.4)' }}
        aria-label="Open chat assistant">
        {open ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{ height: '480px', background: '#FFFFFF', border: '1.5px solid #E5E7EB', boxShadow: '0 8px 40px rgba(79,70,229,0.2)' }}>

          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🤖</div>
            <div>
              <p className="text-white font-semibold text-sm">IILMS Assistant</p>
              <p className="text-white/70 text-xs">Always here to help</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-green-400" title="Online" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: '#F9FAFB' }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 shrink-0 mt-0.5"
                    style={{ background: '#EEF2FF' }}>🤖</div>
                )}
                <div
                  className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                  style={m.sender === 'user'
                    ? { background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', borderBottomRightRadius: '4px' }
                    : { background: '#FFFFFF', color: '#374151', border: '1px solid #E5E7EB', borderBottomLeftRadius: '4px' }}
                  dangerouslySetInnerHTML={{ __html: renderMessage(m.message) }}
                />
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2" style={{ background: '#EEF2FF' }}>🤖</div>
                <div className="px-4 py-2 rounded-2xl text-sm" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#9CA3AF' }}>
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div className="px-3 py-2 flex gap-1.5 overflow-x-auto" style={{ borderTop: '1px solid #F3F4F6' }}>
            {QUICK.map(q => (
              <button key={q} onClick={() => { setInput(q); }}
                className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:scale-105"
                style={{ background: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE' }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={send} className="flex gap-2 p-3" style={{ borderTop: '1px solid #E5E7EB' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 rounded-xl text-sm"
              style={{ background: '#F3F4F6', border: '1.5px solid #E5E7EB', color: '#374151' }}
            />
            <button type="submit" disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-all"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
