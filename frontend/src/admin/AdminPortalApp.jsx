import { Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import LoginAdmin from "./pages/adminAuth/LoginAdmin";
import RegisterAdmin from "./pages/adminAuth/RegisterAdmin";
import AdminRoutes from "./routes/AdminRoutes";

// Guard: only approved normal admins can access
function RequireAdminAuth({ children }) {
  const { token } = useAdminAuth();
  if (!token) return <Navigate to="/admin-portal/login" replace />;
  return children;
}

function AdminPortalInner() {
  return (
    <Routes>
      <Route path="login" element={<LoginAdmin />} />
      <Route path="register" element={<RegisterAdmin />} />
      <Route
        path="*"
        element={
          <RequireAdminAuth>
            <AdminRoutes />
          </RequireAdminAuth>
        }
      />
    </Routes>
  );
}

export default function AdminPortalApp() {
  return (
    <AdminAuthProvider>
      <AdminPortalInner />
    </AdminAuthProvider>
  );
}
