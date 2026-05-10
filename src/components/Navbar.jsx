import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import GlassButton from './GlassButton';

const links = [
  { to: '/', label: 'Home' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/packages', label: 'Packages' },
  { to: '/tracking', label: 'Tracking' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();

  const navClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-glacier-600 dark:text-glacier-400' : 'text-slate-600 dark:text-slate-300 hover:text-glacier-600'}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/30 bg-white/40 px-4 py-3 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-pine-900/50">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold text-pine-900 dark:text-white">
            Kashmir Trek
          </span>
          <span className="hidden sm:inline text-xs font-medium uppercase tracking-wider text-glacier-600 dark:text-glacier-400">
            &amp; Travel
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            className="rounded-lg border border-slate-200/80 bg-white/50 px-3 py-1.5 text-xs font-medium dark:border-white/10 dark:bg-white/5"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          {user ? (
            <>
              <NavLink to="/admin" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Admin
              </NavLink>
              <GlassButton variant="outline" className="!text-slate-800 dark:!text-white" onClick={() => signOut()}>
                Logout
              </GlassButton>
            </>
          ) : (
            <>
              <NavLink to="/login">
                <GlassButton variant="ghost" className="!text-slate-800 dark:!text-white">
                  Login
                </GlassButton>
              </NavLink>
              <NavLink to="/register">
                <GlassButton variant="primary">Register</GlassButton>
              </NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="lg:hidden rounded-lg border border-slate-200/80 p-2 dark:border-white/10"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden mx-auto mt-2 max-w-7xl rounded-2xl border border-white/30 bg-white/90 p-4 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-pine-900/95"
          >
            <div className="flex flex-col gap-3">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className={navClass}>
                  {l.label}
                </NavLink>
              ))}
              <button type="button" onClick={toggle} className="text-left text-sm font-medium">
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              <hr className="border-slate-200 dark:border-white/10" />
              {user ? (
                <>
                  <NavLink to="/admin" onClick={() => setOpen(false)} className="text-sm font-medium">
                    Admin
                  </NavLink>
                  <button type="button" onClick={() => { signOut(); setOpen(false); }} className="text-left text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setOpen(false)} className="text-sm">
                    Login
                  </NavLink>
                  <NavLink to="/register" onClick={() => setOpen(false)} className="text-sm font-semibold text-glacier-600">
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
