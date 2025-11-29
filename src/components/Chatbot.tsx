import React, { useState, useRef, useEffect } from 'react';
import { FaComments } from 'react-icons/fa';
import './Chatbot.css';

const canned: { [k: string]: string } = {
  'hello': 'Hello there! How can I help you with your policies or claims today?',
  'policy': 'You can view your policies under "Policies" page. To add a new policy, choose "Add Policy".',
  'claim': 'To file a claim, visit "Claims" and click "New Claim". You can view status there.',
  'help': 'Ask me about policies, claims, or how to contact your broker. I can also point you to the documentation.'
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Array<{ from: string; text: string }>>([]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const q = input.trim().toLowerCase();
    setMessages((s) => [...s, { from: 'user', text: input }]);
    const matchKey = Object.keys(canned).find(k => q.includes(k));
    let reply = 'I am not sure I understand. Try asking about policies or claims.';
    if (matchKey) reply = canned[matchKey];
    setTimeout(() => setMessages((s) => [...s, { from: 'bot', text: reply }]), 400);
    setInput('');
  }

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth <= 576);
    }
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`chatbot ${open ? 'open' : ''}`} aria-live="polite">
      {open && isMobile && <div className="chatbot-backdrop" onClick={() => setOpen(false)} aria-hidden />}
      <div>
        <button className="btn btn-primary chatbot-button d-flex align-items-center" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="chatbot-panel" aria-label="Open support chat">
          <FaComments style={{ marginRight: 8 }} />
          <span className="d-none d-sm-inline">{open ? 'Close Chat' : 'Chat with us'}</span>
        </button>
      </div>
      {open && (
        <div id="chatbot-panel" className="card chatbot-panel" role={isMobile ? 'dialog' : 'region'} aria-label="Support chat window">
          <div className="chatbot-header">
            <div>Support Chat</div>
            <div>
              <button className="btn-close btn-close-white" aria-label="Close" onClick={() => setOpen(false)} />
            </div>
          </div>
          <div className="chatbot-messages" ref={messagesRef}>
            <div style={{ height: '100%', overflow: 'auto' }}>
              {messages.map((m, i) => (
                <div key={i} className={`chatbot-message ${m.from === 'bot' ? 'bot' : 'user'}`}>
                  <div className="bubble">{m.text}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="chatbot-input p-3">
            <div className="d-flex">
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} className="form-control me-2" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } }} aria-label="Type a message" />
              <button onClick={send} className="btn btn-primary">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
