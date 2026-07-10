import express from "express";
import { registerClient , loginClient} from "../Controllers/clientController.js";


const clientrouter = express.Router();


clientrouter.post("/register", registerClient);
clientrouter.post("/login", loginClient)

export default clientrouter;