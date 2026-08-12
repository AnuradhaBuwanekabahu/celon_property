import axios from "axios";

export function loginSuperAdmin(credentials) {
    return axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/superadmin/login",
        credentials
    );
}

// Used by ProtectedRoute to confirm the token is still valid.
export function getSuperAdminProfile(token) {
    return axios.get(import.meta.env.VITE_BACKEND_URL + "/api/superadmin/me", {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
}

// Super admin creates a new admin account. It should land in the admins
// table with is_approved = FALSE until it's approved below.
export function addAdmin(adminData, token) {
    return axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/superadmin/admins",
        adminData,
        {
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );
}

export function getAllAdmins(token) {
    return axios.get(import.meta.env.VITE_BACKEND_URL + "/api/superadmin/admins", {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
}

// Flips is_approved for a given admin id — this is what the toggle switch
// calls. Also used to block a previously-approved admin by setting it back
// to false.
export function setAdminApproval(id, is_approved, token) {
    return axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/superadmin/admins/" + id + "/approve",
        { is_approved },
        {
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );
}

export function deleteAdmin(id, token) {
    return axios.delete(
        import.meta.env.VITE_BACKEND_URL + "/api/superadmin/admins/" + id,
        {
            headers: {
                Authorization: "Bearer " + token,
            },
        }
    );
}
