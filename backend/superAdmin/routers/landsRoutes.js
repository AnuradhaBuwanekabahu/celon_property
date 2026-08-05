import express from "express";
import db from "../../configuration/db.js";

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
    "/",
    addLands
);

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

landsRouter.get(
    "/status/:status",
    getlands
);

landsRouter.get(
    "/search",
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

landsRouter.patch(
    "/:id/status",
    async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await db.query("UPDATE land SET status = ? WHERE id = ?", [status, id]);
            res.json({ success: true, data: { id, status } });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
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