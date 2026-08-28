import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RequireAuth({ children }) {
  const { token, admin } = useAuth();
  if (!token) return <Navigate to="/admin/login" replace />;
  // Normal admins should not access super admin portal
  if (admin?.role === 'admin') return <Navigate to="/admin-portal/login" replace />;
  return children;
}

export function RequireSuperAdmin({ children }) {
  const { token, admin, isSuperAdmin } = useAuth();
  if (!token) return <Navigate to="/admin/login" replace />;
  if (admin?.role === 'admin') return <Navigate to="/admin-portal/login" replace />;
  if (!isSuperAdmin) return <Navigate to="/admin" replace />;
  return children;
}
