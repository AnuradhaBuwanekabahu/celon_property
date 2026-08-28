import express from "express";

import { getAdminProfile, loginAdmin, registerAdmin, updateAdminProfile } from "../Controllers/adminController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const normalAdminAuthRouter = express.Router();



normalAdminAuthRouter.post("/register", registerAdmin);

normalAdminAuthRouter.post("/login", loginAdmin);

normalAdminAuthRouter.get(
    "/profile",
    authMiddleware,
    getAdminProfile
);


normalAdminAuthRouter.put(
    "/profile",
    authMiddleware,
    updateAdminProfile
);



export default normalAdminAuthRouter;