import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RequireAuth({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

export function RequireSuperAdmin({ children }) {
  const { token, isSuperAdmin } = useAuth();
  if (!token) return <Navigate to="/admin/login" replace />;
  if (!isSuperAdmin) return <Navigate to="/admin" replace />;
  return children;
}
