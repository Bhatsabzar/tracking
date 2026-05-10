import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import AdminDenied from './AdminDenied';

/**
 * Verifies admin via a fresh getUser() so production JWT matches Supabase app_metadata.role
 * (avoids stale client state after you assign admin in SQL).
 */
export default function AdminGate() {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user || !isSupabaseConfigured() || !supabase) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (cancelled) return;
      if (error) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }
      const role = data.user?.app_metadata?.role;
      setIsAdmin(role === 'admin');
      setChecking(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  if (loading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-pine-900">
        <p className="text-slate-500">Checking admin access…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminDenied />;
  }

  return <Outlet />;
}

