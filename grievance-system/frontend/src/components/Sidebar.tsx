import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Building2,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/complaints', icon: FileText, label: 'Complaints' },
  { to: '/admin/departments', icon: Building2, label: 'Departments' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg p-2 lg:hidden bg-white shadow-md"
        aria-label="Open menu"
      >
        <Menu size={24} className="text-gov-primary" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : -280 }}
        className="fixed left-0 top-0 z-50 h-full w-72 border-r border-slate-200 bg-white shadow-lg lg:translate-x-0"
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <Logo showText={false} className="gap-2" />
          <button
            onClick={() => setOpen(false)}
            className="rounded p-2 lg:hidden hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gov-primary text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-gov-primary'
                }`
              }
            >
              <item.icon size={20} strokeWidth={1.5} />
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} strokeWidth={1.5} />
            Logout
          </button>
        </nav>
      </motion.aside>
    </>
  );
}
