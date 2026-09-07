import express from "express";
import upload from "../Middleware/upload.js";
import {
  addWanted,
  showAllWanted,
  showWantedByUserId,
  deleteWanted,
} from "../../user/controllers/wantedController.js";

const wantedRouter = express.Router();

wantedRouter.post(
  "/add",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "images", maxCount: 10 },
    { name: "gallery_images", maxCount: 10 },
  ]),
  addWanted
);
wantedRouter.get("/showall", showAllWanted);
wantedRouter.get("/user/:id", showWantedByUserId);
wantedRouter.delete("/delete/:id", deleteWanted);

export default wantedRouter;
