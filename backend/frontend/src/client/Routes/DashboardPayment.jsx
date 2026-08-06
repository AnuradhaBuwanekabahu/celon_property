import { useLocation, Navigate } from "react-router-dom";
import DashboardHomePayment from '../pages/dashboard/Payment/DashboardHomePayment'

const DashboardPayment = () => {
    const { state } = useLocation();

    if (!state) {
        return <Navigate to="/dashboard" replace />;
    }

    return <DashboardHomePayment{...state} />;
};

export default DashboardPayment;