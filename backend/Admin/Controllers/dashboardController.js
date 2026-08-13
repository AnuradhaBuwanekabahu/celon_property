
import db from "../../configuration/db.js";

// =======================================================
// GET DASHBOARD
// =======================================================

export const getDashboard = async (req, res) => {

    try {

        // ===============================
        // TOTAL HOT SALES
        // ===============================

        const [[hotSales]] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM hot_sales
            `
        );


        // ===============================
        // TOTAL STAY TO BUY
        // ===============================

        const [[stayBuy]] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM stays_to_buy
            `
        );


        // ===============================
        // TOTAL STAY TO RENT
        // ===============================

        const [[stayRent]] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM stays_to_rent
            `
        );


        // ===============================
        // TOTAL LAND
        // ===============================

        const [[lands]] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM land
            `
        );


        // ===============================
        // TOTAL CLIENTS
        // ===============================

        const [[clients]] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM clients
            `
        );


       


        // ===============================
        // TOTAL ADS
        // ===============================

        const [[ads]] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM ads
            `
        );


        


        


        // ===============================
        // PROPERTY STATUS COUNTS
        // ===============================

        const [[activeProperties]] = await db.query(
            `
            SELECT
                (
                    SELECT COUNT(*)
                    FROM hot_sales
                    WHERE status = 'active'
                )
                +
                (
                    SELECT COUNT(*)
                    FROM stays_to_buy
                    WHERE status = 'active'
                )
                +
                (
                    SELECT COUNT(*)
                    FROM stays_to_rent
                    WHERE status = 'active'
                )
                +
                (
                    SELECT COUNT(*)
                    FROM land
                    WHERE status = 'active'
                )
                AS total
            `
        );


        const [[pendingProperties]] = await db.query(
            `
            SELECT
                (
                    SELECT COUNT(*)
                    FROM hot_sales
                    WHERE status = 'pending'
                )
                +
                (
                    SELECT COUNT(*)
                    FROM stays_to_buy
                    WHERE status = 'pending'
                )
                +
                (
                    SELECT COUNT(*)
                    FROM stays_to_rent
                    WHERE status = 'pending'
                )
                +
                (
                    SELECT COUNT(*)
                    FROM land
                    WHERE status = 'pending'
                )
                AS total
            `
        );


        const [[soldProperties]] = await db.query(
            `
            SELECT
                (
                    SELECT COUNT(*)
                    FROM hot_sales
                    WHERE status = 'sold'
                )
                +
                (
                    SELECT COUNT(*)
                    FROM stays_to_buy
                    WHERE status = 'sold'
                )
                +
                (
                    SELECT COUNT(*)
                    FROM stays_to_rent
                    WHERE status = 'sold'
                )
                +
                (
                    SELECT COUNT(*)
                    FROM land
                    WHERE status = 'sold'
                )
                AS total
            `
        );


        // ===============================
        // RESPONSE
        // ===============================

        res.json({

            success: true,

            data: {

                hotSales: hotSales.total,

                stayBuy: stayBuy.total,

                stayRent: stayRent.total,

                lands: lands.total,

                clients: clients.total,

                

                ads: ads.total,

               

              

                activeProperties:
                    activeProperties.total,

                pendingProperties:
                    pendingProperties.total,

                soldProperties:
                    soldProperties.total

            }

        });


    } catch (error) {

        console.log(
            "DASHBOARD ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
