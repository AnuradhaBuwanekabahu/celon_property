import express from "express";
import upload from "../Middleware/upload.js";
import { addWanted, showAllWanted, showWantedByUserId, deleteWanted } from "../Controllers/wantedController.js";

const wantedRouter = express.Router();

wantedRouter.post("/add", upload.single("main_image"), addWanted);
wantedRouter.get("/showall", showAllWanted);
wantedRouter.get("/user/:id", showWantedByUserId);
wantedRouter.delete("/delete/:id", deleteWanted);

export default wantedRouter;
