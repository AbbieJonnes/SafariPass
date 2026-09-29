import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faXmark, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../api/axiosInstance';

const pageLabels = {
  '/': 'the Landing page',
  '/login': 'the Login page',
  '/register': 'the Register page',
  '/passenger/dashboard': 'the Passenger dashboard',
  '/passenger/browse': 'Browse Routes',
  '/passenger/qr': 'My QR Pass',
  '/passenger/shift': 'Route Shift',
  '/passenger/payments': 'Payment History',
  '/passenger/profile': 'their Profile',
  '/passenger/map': 'the Route Map',
  '/conductor/dashboard': 'the Conductor dashboard',
  '/conductor/scan': 'Scan Pass',
  '/conductor/history': 'Validation History',
  '/admin/dashboard': 'the Company Admin dashboard',
  '/admin/routes': 'Manage Routes',
  '/admin/fares': 'Manage Fares',
  '/admin/plan-types': 'Plan Types',
  '/admin/add-conductor': 'Add Conductor',
  '/admin/subscriptions': 'Subscriptions',
  '/admin/analytics': 'Analytics',
  '/super-admin/dashboard': 'the Super Admin dashboard',
  '/super-admin/companies': 'Manage Companies',
  '/super-admin/users': 'Manage Users',
  '/super-admin/add-admin': 'Add Company Admin',
};

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi, I'm the SafariPass assistant. Ask me anything about using the app." },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setSending(true);

    const pageContext = pageLabels[location.pathname] || 'a page in SafariPass';

    axiosInstance.post('/chatbot/', { message: text, page_context: pageContext })
      .then((res) => {
        setMessages((prev) => [...prev, { role: 'assistant', text: res.data.reply }]);
      })
      .catch(() => {
        setMessages((prev) => [...prev, { role: 'assistant', text: "Sorry, something went wrong. Please try again." }]);
      })
      .finally(() => setSending(false));
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition"
      >
        <FontAwesomeIcon icon={open ? faXmark : faComments} className="text-xl" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ height: '480px' }}>
          <div className="bg-primary text-white px-4 py-3 font-semibold">
            SafariPass Assistant
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  m.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-textdark'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-400 rounded-2xl px-3 py-2 text-sm">Typing...</div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-gray-100 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-primary text-white w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-90 transition disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatWidget;