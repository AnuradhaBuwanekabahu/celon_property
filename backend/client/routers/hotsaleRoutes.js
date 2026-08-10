import express from "express"
import { addHotSale, getHotSales, getHotSaleById, editHotSale, deleteHotSale, showallhotsales } from "../Controllers/hotsalesController.js";
import upload from "../Middleware/upload.js";

const hotsalerouter = express.Router();
hotsalerouter.post(
    "/add",
    upload.fields([
        {
            name:"main_image",
            maxCount:1
        },
        {
            name:"main_video",
            maxCount:1
        },
        {
            name:"images",
            maxCount:10
        }
    ]),
    addHotSale
);

hotsalerouter.get( "/show",  getHotSales);
hotsalerouter.get("/showall", showallhotsales);
hotsalerouter.get("/show/:id", getHotSaleById);

hotsalerouter.put("/edit/:id", upload.fields([
        {
            name:"main_image",
            maxCount:1
        },
        {
            name:"main_video",
            maxCount:1
        },
        {
            name:"images",
            maxCount:10
        }
    ]),
    editHotSale
);

hotsalerouter.delete( "/delete/:id", deleteHotSale);
export default hotsalerouter;