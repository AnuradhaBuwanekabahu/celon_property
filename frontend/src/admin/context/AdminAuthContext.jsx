import { createContext, useContext, useState, useCallback } from 'react';

const AdminAuthContext = createContext(null);

function loadStoredAdmin() {
  try {
    const raw = localStorage.getItem('normal_admin');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(loadStoredAdmin);
  const [token, setToken] = useState(() => localStorage.getItem('normal_admin_token'));

  const login = useCallback((tokenValue, adminData) => {
    localStorage.setItem('normal_admin_token', tokenValue);
    localStorage.setItem('normal_admin', JSON.stringify(adminData));
    setToken(tokenValue);
    setAdmin(adminData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('normal_admin_token');
    localStorage.removeItem('normal_admin');
    setToken(null);
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
