import React, { useState } from 'react';
import axios from 'axios';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Get the JWT token that is saved during login
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await axios.post(
        'http://127.0.0.1:8000/ai/chat',
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...newMessages, { sender: 'bot', text: response.data.reply }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages([...newMessages, { sender: 'bot', text: 'Error: Could not reach the AI. Are you logged in?' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ backgroundColor: '#6ea8fe', color: '#0f1115', border: 'none', padding: '14px 24px', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', fontSize: '1rem' }}
        >
          💬 Ask AI
        </button>
      ) : (
        <div style={{ width: '360px', height: '500px', backgroundColor: '#161922', border: '1px solid #2a2f3a', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          {/* Header */}
          <div style={{ backgroundColor: '#0f1115', padding: '16px', borderBottom: '1px solid #2a2f3a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: '#e6e8ee' }}>StudentSync Assistant</strong>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#a3a9b8', cursor: 'pointer', fontSize: '1.2rem' }}>✖</button>
          </div>
          
          {/* Chat History */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.length === 0 && <div style={{ color: '#a3a9b8', textAlign: 'center', marginTop: '40px' }}>How can I help you with your coursework today?</div>}
            
            {messages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', backgroundColor: msg.sender === 'user' ? '#6ea8fe' : '#1c202b', color: msg.sender === 'user' ? '#0f1115' : '#e6e8ee', padding: '10px 14px', borderRadius: '8px', maxWidth: '85%', wordBreak: 'break-word', lineHeight: '1.5' }}>
                {msg.text}
              </div>
            ))}
            
            {loading && <div style={{ color: '#a3a9b8', fontSize: '0.9rem', fontStyle: 'italic' }}>AI is typing...</div>}
          </div>

          {/* Input Area */}
          <div style={{ padding: '16px', borderTop: '1px solid #2a2f3a', display: 'flex', gap: '8px', backgroundColor: '#0f1115' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #2a2f3a', backgroundColor: '#161922', color: '#e6e8ee', outline: 'none' }}
            />
            <button onClick={handleSend} disabled={loading} style={{ backgroundColor: '#6ea8fe', color: '#0f1115', border: 'none', padding: '0 20px', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}