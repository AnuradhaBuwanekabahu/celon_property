import express from "express";
import {
  registerUserWithEmail,
  loginUserWithEmail,
  loginUserWithGoogle,
} from "../Controllers/userController.js";

const userrouter = express.Router();

userrouter.post("/register", registerUserWithEmail);
userrouter.post("/login", loginUserWithEmail);
userrouter.post("/google", loginUserWithGoogle);

export default userrouter;
