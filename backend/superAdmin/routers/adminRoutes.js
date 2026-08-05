import express from "express";
import { 
    loginAdmin, 
    getAdmins, 
    getPendingAdmins, 
    getApprovedAdmins, 
    createAdmin, 
    approveAdmin, 
    deleteAdmin 
} from "../Controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.get("/", getAdmins);
adminRouter.get("/pending", getPendingAdmins);
adminRouter.get("/approved", getApprovedAdmins);
adminRouter.post("/", createAdmin);
adminRouter.patch("/:id/approve", approveAdmin);
adminRouter.delete("/:id/reject", deleteAdmin);
adminRouter.delete("/:id", deleteAdmin);

export default adminRouter;
