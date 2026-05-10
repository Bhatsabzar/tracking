import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export function useIsAdmin() {
  const { user } = useAuth();
  return useMemo(() => {
    const role = user?.app_metadata?.role;
    return role === 'admin';
  }, [user]);
}

