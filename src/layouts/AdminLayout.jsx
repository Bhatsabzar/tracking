import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-pine-900">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pt-28 pb-16">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <h1 className="font-display text-3xl font-semibold text-slate-900 dark:text-white">Admin dashboard</h1>
          <Link to="/" className="text-sm text-glacier-600 hover:underline dark:text-glacier-400">
            ← Back to site
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
