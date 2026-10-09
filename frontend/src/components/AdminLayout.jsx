import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from './Navbar';

function AdminLayout({ title, navItems, children }) {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar hideBack />

      <div className="md:hidden bg-primary px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs ${
                isActive ? 'bg-white/10 text-accent font-semibold' : 'text-gray-300'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-1 min-h-0">
        <aside className="w-64 bg-primary text-white flex-shrink-0 hidden md:block overflow-y-auto">
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

        <main className="flex-1 min-w-0 overflow-y-auto px-6 lg:px-10 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;