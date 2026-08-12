import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "./loader";
import { getSuperAdminProfile } from "../api/superAdminAuth";

// role = "admin" or "superadmin"
export default function ProtectedRoute({ role, children }) {
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token == null) {
            toast.error("You are not logged in");
            navigate("/" + role + "/login");
            return;
        }

        const request =
            role === "admin" ? getAdminProfile(token) : getSuperAdminProfile(token);

        request
            .then((res) => {
                if (res.data.role === role) {
                    setValidated(true);
                } else {
                    toast.error("You are not authorized");
                    navigate("/" + role + "/login");
                }
            })
            .catch((error) => {
                console.error("Error validating session:", error);
                toast.error("Session expired, please log in again");
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/" + role + "/login");
            });
    }, []);

    return validated ? children : <Loader />;
}
