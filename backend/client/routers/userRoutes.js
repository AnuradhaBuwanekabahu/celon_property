import express from "express";
import {
  registerUserWithEmail,
  loginUserWithEmail,
  loginUserWithGoogle,
  verifyUserRegistrationOtp,
  resendUserRegistrationOtp,
  sendPropertyInquiry,
} from "../Controllers/userController.js";

const userrouter = express.Router();

userrouter.post("/register", registerUserWithEmail);
userrouter.post("/verify-otp", verifyUserRegistrationOtp);
userrouter.post("/resend-otp", resendUserRegistrationOtp);
userrouter.post("/login", loginUserWithEmail);
userrouter.post("/google", loginUserWithGoogle);
userrouter.post("/inquiry", sendPropertyInquiry);
export default userrouter;
