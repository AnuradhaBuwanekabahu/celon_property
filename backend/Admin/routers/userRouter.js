import express from "express";
import {  getTotalUsers, getUserById, getUsers, updateUser } from "../Controllers/userController.js";

const userRouter = express.Router();
userRouter.get("/count", getTotalUsers);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", updateUser);

export default userRouter;