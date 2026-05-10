import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassButton from '../components/GlassButton';
import { isSupabaseConfigured } from '../supabase/client';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!isSupabaseConfigured()) {
      setError('Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
      return;
    }
    const { error: err, data } = await signUp(email, password, { full_name: fullName });
    if (err) setError(err.message);
    else if (data.user && !data.session) {
      setInfo('Check your email to confirm your account (if confirmation is enabled in Supabase).');
    } else navigate('/', { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-display text-3xl font-semibold text-slate-900 dark:text-white">Create account</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Secure registration via Supabase</p>
      <form onSubmit={submit} className="glass-panel mt-8 space-y-4 rounded-2xl p-6">
        {error && <p className="text-sm text-rose-600">{error}</p>}
        {info && <p className="text-sm text-emerald-700 dark:text-emerald-300">{info}</p>}
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">Full name</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">Email</label>
          <input
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">Password</label>
          <input
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <GlassButton type="submit" variant="primary" className="w-full">
          Register
        </GlassButton>
        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-glacier-600 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
