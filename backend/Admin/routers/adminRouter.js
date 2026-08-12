import express from "express";

import { getAdminProfile, loginAdmin, registerAdmin, updateAdminProfile } from "../Controllers/adminController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const adminRouter = express.Router();



adminRouter.post("/register", registerAdmin);

adminRouter.post("/login", loginAdmin);

adminRouter.get(
    "/profile",
    authMiddleware,
    getAdminProfile
);


adminRouter.put(
    "/profile",
    authMiddleware,
    updateAdminProfile
);



export default adminRouter;