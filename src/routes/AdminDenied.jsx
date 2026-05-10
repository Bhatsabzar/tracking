import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDenied() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const signOutAndLogin = async () => {
    await signOut();
    navigate('/login', { replace: true, state: { from: '/admin' } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-pine-900">
      <div className="glass-panel max-w-md rounded-2xl p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">Admin access required</h1>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          This account does not have the <code className="rounded bg-slate-200/80 px-1 dark:bg-white/10">admin</code> role in
          Supabase (<code className="rounded bg-slate-200/80 px-1 dark:bg-white/10">app_metadata.role</code>).
        </p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          If you just promoted this user in the database, <strong>sign out and sign in again</strong> so the new JWT includes
          the role.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="rounded-xl bg-glacier-600 px-4 py-2 text-sm font-semibold text-white hover:bg-glacier-500"
          >
            Back to home
          </Link>
          <button
            type="button"
            onClick={signOutAndLogin}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 dark:border-white/20 dark:text-white"
          >
            Sign out &amp; sign in
          </button>
        </div>
      </div>
    </div>
  );
}
