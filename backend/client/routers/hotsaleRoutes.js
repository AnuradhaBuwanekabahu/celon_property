import express from "express"
import { addHotSale ,getHotSales , editHotSale,deleteHotSale} from "../Controllers/hotsalesController.js";
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
            name:"images",
            maxCount:10
        }
    ]),
    addHotSale
);


hotsalerouter.get(
    "/show",
    getHotSales
);

hotsalerouter.put(
    "/:id",
    upload.fields([
        {
            name:"main_image",
            maxCount:1
        },
        {
            name:"images",
            maxCount:10
        }
    ]),
    editHotSale
);

hotsalerouter.delete(
    "/:id",
    deleteHotSale
);
export default hotsalerouter;