import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/20 bg-pine-900/90 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 md:flex md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg text-white">Kashmir Trek &amp; Travel Tracker</p>
          <p className="mt-1 text-sm text-slate-400">Crafted for Himalayan adventures.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 md:mt-0 text-sm">
          <Link to="/packages" className="hover:text-white">
            Packages
          </Link>
          <Link to="/tracking" className="hover:text-white">
            Tracking
          </Link>
          <Link to="/contact" className="hover:text-white">
            Contact
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Kashmir Trek &amp; Travel Tracker
      </div>
    </footer>
  );
}
