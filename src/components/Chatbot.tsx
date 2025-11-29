import React, { useState, useRef, useEffect } from 'react';
import { FaComments } from 'react-icons/fa';
import './Chatbot.css';
import api from '../api';

const canned: { [k: string]: string } = {
  'hello': 'Hello there! How can I help you with your policies or claims today?',
  'policy': 'You can view your policies under "Policies" page. To add a new policy, choose "Add Policy".',
  'claim': 'To file a claim, visit "Claims" and click "New Claim". You can view status there.',
  'help': 'Ask me about policies, claims, or how to contact your broker. I can also point you to the documentation.'
};

const quickReplies: { key: string; label: string }[] = [
  { key: 'policy', label: 'Policies' },
  { key: 'claim', label: 'Claims' },
  { key: 'forgot', label: 'Forgot Password' },
  { key: 'buy', label: 'Where is Buy Now?' },
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Array<{ from: string; text: string }>>([]);
  const [input, setInput] = useState('');
  const [userName, setUserName] = useState('');

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

  const handleQuick = (key: string) => {
    const label = quickReplies.find(q => q.key === key)?.label || key;
    setMessages((s) => [...s, { from: 'user', text: label }]);
    if (key === 'forgot') {
      setTimeout(() => setMessages((s) => [...s, { from: 'bot', text: 'Please register and login again and try to save your credentials in the Google browser.' }]), 240);
      return;
    }
    if (key === 'buy') {
      setTimeout(() => setMessages((s) => [...s, { from: 'bot', text: 'Please hover over the policy you need to buy. Buy Now option will be present over there that will redirect you to the form.' }]), 240);
      return;
    }
    const reply = canned[key] || 'Sorry, I do not have an answer for that yet.';
    setTimeout(() => setMessages((s) => [...s, { from: 'bot', text: reply }]), 240);
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
    async function fetchUserData() {
      const token = localStorage.getItem('jwt');
      if (!token) return;
      try {
        const res = await api.get('/auth/me');
        const user = (res.data as any).user;
        if (user) {
          if (user.name) setUserName(user.name);
          else if (user.email) setUserName((user.email as string).split('@')[0]);
        }
      } catch (err) {
        // ignore
      }
    }
    fetchUserData();
  }, []);
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);
  useEffect(() => {
    if (open && messages.length === 0) {
      const who = userName || 'there';
      setMessages((s) => [...s, { from: 'bot', text: `Hi ${who}! 👋 How can I help you today?` }]);
    }
  }, [open, userName]);

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
          <div className="p-2 chatbot-options">
            {quickReplies.map((q) => (
              <button key={q.key} className="btn btn-sm btn-outline-secondary me-1 mb-1" onClick={() => handleQuick(q.key)}>{q.label}</button>
            ))}
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
