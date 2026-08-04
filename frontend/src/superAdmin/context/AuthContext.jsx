import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

function loadStoredAdmin() {
  try {
    const raw = localStorage.getItem('ceylone_admin');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(loadStoredAdmin());
  const [token, setToken] = useState(localStorage.getItem('ceylone_token'));

  const login = useCallback(async (name, password) => {
    const res = await api.post('/admin/login', { name, password }, { auth: false });
    const newToken = res.token || res.data?.token;
    const adminData = res.admin || res.data?.admin;
    if (!newToken) {
      throw new Error(res.message || 'Login failed');
    }
    localStorage.setItem('ceylone_token', newToken);
    localStorage.setItem('ceylone_admin', JSON.stringify(adminData));
    setToken(newToken);
    setAdmin(adminData);
    return adminData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ceylone_token');
    localStorage.removeItem('ceylone_admin');
    setToken(null);
    setAdmin(null);
  }, []);

  const isSuperAdmin = admin?.role === 'super_admin';

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
