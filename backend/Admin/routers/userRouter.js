import express from "express";
import {  getTotalUsers, getUserById, getUsers, updateUser } from "../Controllers/userController.js";

const adminUsersRouter = express.Router();
adminUsersRouter.get("/count", getTotalUsers);
adminUsersRouter.get("/", getUsers);
adminUsersRouter.get("/:id", getUserById);
adminUsersRouter.put("/:id", updateUser);

export default adminUsersRouter;