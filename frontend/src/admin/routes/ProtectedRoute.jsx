import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const ProtectedRouted = ({ children }) => {
    const { token } = useAdminAuth();

    if (!token) {
        return <Navigate to="/admin-portal/login" replace />;
    }

    return children;
};

export default ProtectedRouted;