import { Navigate, Outlet } from 'react-router-dom';
import { useIsAdmin } from '../hooks/useIsAdmin';

export default function AdminGate() {
  const isAdmin = useIsAdmin();
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

