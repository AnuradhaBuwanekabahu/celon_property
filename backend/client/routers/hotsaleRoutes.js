import express from "express"
import { addHotSale ,getHotSales , editHotSale} from "../Controllers/hotsalesController";
import upload from "../Middleware/upload";

const hotsalerouter = express.Router();
hotsalerouter.post(
    "/hot-sales",
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