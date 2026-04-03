import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';
import { getStoredUser } from '../lib/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = getStoredUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/submit', label: 'Submit Complaint' },
    { to: '/track', label: 'Track Complaint' },
  ];

  return (
    <header className="gov-header sticky top-0 z-30">
      <div className="gov-brand-bar">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5">
          <span className="font-semibold tracking-wide uppercase text-gov-navy">
            National Grievance Redressal Portal
          </span>
          <span className="text-xs opacity-90 text-gov-navy">
            Government of India • JanSamadhan.ai
          </span>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gov-primary text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-gov-primary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user.token ? (
            <>
              {user.role === 'ADMIN' ? (
                <Link
                  to="/admin/dashboard"
                  className="ml-2 rounded-lg bg-gov-accent px-4 py-2 text-sm font-medium text-white hover:bg-gov-accent/90 transition-colors"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="ml-2 rounded-lg bg-gov-primary px-4 py-2 text-sm font-medium text-white hover:bg-gov-primaryLight transition-colors"
                >
                  My Complaints
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="ml-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="ml-2 rounded-lg border-2 border-gov-primary px-4 py-2 text-sm font-medium text-gov-primary hover:bg-gov-primary hover:text-white transition-colors"
            >
              Login
            </Link>
          )}
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 md:hidden hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-slate-200 bg-white px-4 py-3 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-gov-primary text-white' : 'text-slate-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {user.token && (
              <>
                <Link
                  to={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gov-primary"
                >
                  {user.role === 'ADMIN' ? 'Admin Dashboard' : 'My Complaints'}
                </Link>
                <button
                  onClick={() => { handleLogout(); }}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700"
                >
                  Logout
                </button>
              </>
            )}
            {!user.token && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gov-primary"
              >
                Login
              </Link>
            )}
          </div>
        </motion.nav>
      )}
    </header>
  );
}
