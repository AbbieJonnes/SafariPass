import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from './Navbar';

function AdminLayout({ title, subtitle, navItems, children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-72px)]">
        <aside className="w-64 bg-primary text-white flex-shrink-0 hidden md:block">
          <div className="p-6">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-4">
              {title}
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                      isActive
                        ? 'bg-white/10 text-accent font-semibold'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="px-6 py-10 max-w-5xl">
            {subtitle && (
              <div className="mb-8">
                <p className="text-gray-500">{subtitle}</p>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;