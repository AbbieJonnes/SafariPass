import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faXmark, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const RULES = [
  {
    keywords: ['subscribe', 'subscription', 'browse route', 'pick a route', 'choose a route'],
    reply: "To subscribe, go to your Passenger Dashboard and click 'Browse Routes'. Pick a company, then a route, then a plan (Full Day or Peak Hours), and confirm.",
    link: { label: 'Go to Browse Routes', to: '/passenger/browse' },
  },
  {
    keywords: ['qr', 'pass', 'ticket'],
    reply: "Your QR pass is on the 'My QR Pass' page. It's a static code — just show it to the conductor when boarding.",
    link: { label: 'View My QR Pass', to: '/passenger/qr' },
  },
  {
    keywords: ['shift', 'change route', 'different route', 'switch route'],
    reply: "You can temporarily switch to a different route up to 3 times per subscription, on the Route Shift page. If the new route costs more, you'll pay the difference.",
    link: { label: 'Go to Route Shift', to: '/passenger/shift' },
  },
  {
    keywords: ['payment', 'paid', 'receipt', 'mpesa', 'm-pesa', 'transaction'],
    reply: "All your past M-Pesa payments are listed on the Payment History page.",
    link: { label: 'View Payment History', to: '/passenger/payments' },
  },
  {
    keywords: ['map', 'track', 'location', 'gps', 'where am i'],
    reply: "The Route Map shows your route and your live location, with your permission, right in your browser.",
    link: { label: 'Open Route Map', to: '/passenger/map' },
  },
  {
    keywords: ['profile', 'password', 'change password', 'picture', 'account details'],
    reply: "You can update your username, email, profile picture, and password from the Profile page.",
    link: { label: 'Go to Profile', to: '/passenger/profile' },
  },
  {
    keywords: ['scan', 'validate', 'conductor'],
    reply: "Conductors can scan a passenger's QR pass from the Scan Pass page using their camera. It instantly shows whether the pass is active, expired, or invalid.",
    link: { label: 'Go to Scan Pass', to: '/conductor/scan' },
  },
  {
    keywords: ['add conductor', 'new conductor', 'hire conductor'],
    reply: "Company Admins can add a conductor from the Add Conductor page. The new conductor gets an email to set their own password.",
    link: { label: 'Add Conductor', to: '/admin/add-conductor' },
  },
  {
    keywords: ['route', 'add route', 'manage route'],
    reply: "Company Admins can add and view routes from the Manage Routes page.",
    link: { label: 'Manage Routes', to: '/admin/routes' },
  },
  {
    keywords: ['fare', 'price', 'pricing'],
    reply: "Fares are set per route on the Manage Fares page. Changing a fare emails everyone affected.",
    link: { label: 'Manage Fares', to: '/admin/fares' },
  },
  {
    keywords: ['plan type', 'peak hour', 'full day'],
    reply: "Plan types (Full Day or Peak Hours, weekly or monthly) are set on the Plan Types page.",
    link: { label: 'Plan Types', to: '/admin/plan-types' },
  },
  {
    keywords: ['company', 'add company'],
    reply: "Super Admins can add new transport companies from the Manage Companies page.",
    link: { label: 'Manage Companies', to: '/super-admin/companies' },
  },
  {
    keywords: ['admin', 'add admin', 'company admin'],
    reply: "Super Admins can add a Company Admin for a specific company from the Add Company Admin page.",
    link: { label: 'Add Company Admin', to: '/super-admin/add-admin' },
  },
  {
    keywords: ['user', 'manage user', 'all users'],
    reply: "Super Admins can see every user on the platform, grouped by company, from the Manage Users page.",
    link: { label: 'Manage Users', to: '/super-admin/users' },
  },
  {
    keywords: ['analytic', 'revenue', 'report', 'stat'],
    reply: "Revenue, active subscriptions, and route popularity are shown on the Analytics page.",
    link: { label: 'View Analytics', to: '/admin/analytics' },
  },
  {
    keywords: ['register', 'sign up', 'create account'],
    reply: "New passengers can create an account from the Register page. It only takes a minute.",
    link: { label: 'Go to Register', to: '/register' },
  },
  {
    keywords: ['login', 'log in', 'sign in'],
    reply: "You can log in from the Login page using your username and password.",
    link: { label: 'Go to Login', to: '/login' },
  },
  {
    keywords: ['forgot', 'reset password'],
    reply: "If you've forgotten your password, use the Forgot Password page to get a reset link by email.",
    link: { label: 'Reset Password', to: '/forgot-password' },
  },
];

const FALLBACK = "You Can Try asking about subscribing, your QR pass, route shifts, payments, or the map, or check the relevant dashboard for more options.";

function getReply(text) {
  const lower = text.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule;
    }
  }
  return { reply: FALLBACK, link: null };
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hey There, I'm the SafariPass assistant. Ask me about subscribing, your QR pass, route shifts, payments, or the map." },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const handleSend = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const match = getReply(text);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text },
      { role: 'assistant', text: match.reply, link: match.link },
    ]);
    setInput('');
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
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  m.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-textdark'
                }`}>
                  <p>{m.text}</p>
                  {m.link && (
                    <button
                      onClick={() => { navigate(m.link.to); setOpen(false); }}
                      className="mt-2 text-secondary font-medium text-xs underline"
                    >
                      {m.link.label} →
                    </button>
                  )}
                </div>
              </div>
            ))}
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
              className="bg-primary text-white w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-90 transition"
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