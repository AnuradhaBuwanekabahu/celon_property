import express from "express";


import {

    addLands,
    getlands,
    getLandById,
    updateLand,
    deleteLand

} from "../Controllers/landsController.js";



const landsRouter = express.Router();




// ===============================
// ADD LAND
// POST /api/superadmin/lands/add
// ===============================

landsRouter.post(
    "/add",
    addLands
);





// ===============================
// GET ALL LANDS
// GET /api/superadmin/lands
// ===============================

landsRouter.get(
    "/",
    getlands
);





// ===============================
// GET SINGLE LAND
// GET /api/superadmin/lands/:id
// ===============================

landsRouter.get(
    "/:id",
    getLandById
);





// ===============================
// UPDATE LAND
// PUT /api/superadmin/lands/:id
// ===============================

landsRouter.put(
    "/:id",
    updateLand
);





// ===============================
// DELETE LAND
// DELETE /api/superadmin/lands/:id
// ===============================

landsRouter.delete(
    "/:id",
    deleteLand
);





export default landsRouter;