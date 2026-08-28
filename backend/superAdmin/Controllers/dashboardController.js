import db from "../../configuration/db.js";

export const getSystemStats = async (req, res) => {
    try {
        // Total Clients
        const [[{ total_clients }]] = await db.query("SELECT COUNT(*) as total_clients FROM clients");

        // Total Properties in each table
        let hot_sales = 0, stays_to_buy = 0, stays_to_rent = 0, land = 0, wanted = 0;

        try {
            const [[r]] = await db.query("SELECT COUNT(*) as c FROM hot_sales");
            hot_sales = r.c;
        } catch (e) {}

        try {
            const [[r]] = await db.query("SELECT COUNT(*) as c FROM stays_to_buy");
            stays_to_buy = r.c;
        } catch (e) {}

        try {
            const [[r]] = await db.query("SELECT COUNT(*) as c FROM stays_to_rent");
            stays_to_rent = r.c;
        } catch (e) {}

        try {
            const [[r]] = await db.query("SELECT COUNT(*) as c FROM land");
            land = r.c;
        } catch (e) {}

        try {
            const [[r]] = await db.query("SELECT COUNT(*) as c FROM wanted");
            wanted = r.c;
        } catch (e) {}

        // Total Payments & Revenue
        let total_payments = 0, total_revenue = 0;
        try {
            const [[r]] = await db.query("SELECT COUNT(*) as total_payments, COALESCE(SUM(amount), 0) as total_revenue FROM payments");
            total_payments = r.total_payments;
            total_revenue = r.total_revenue;
        } catch (e) {}

        return res.status(200).json({
            success: true,
            data: {
                total_clients: total_clients || 0,
                total_properties: {
                    hot_sales: hot_sales || 0,
                    stays_to_buy: stays_to_buy || 0,
                    stays_to_rent: stays_to_rent || 0,
                    land: land || 0,
                    wanted: wanted || 0
                },
                total_payments: total_payments || 0,
                total_revenue: total_revenue || 0
            }
        });

    } catch (error) {
        console.error("Get System Stats Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch system stats"
        });
    }
};

export const getRecentActivity = async (req, res) => {
    try {
        let recent_properties = [];
        try {
            const [rows] = await db.query(
                `SELECT p.id, p.title, p.city, p.price, p.type, COALESCE(c.full_name, 'Client') as client_name
                 FROM (
                   SELECT id, title, city, price, 'Hot Sale' AS type, client_id, created_at FROM hot_sales
                   UNION ALL
                   SELECT id, title, city, price, 'Stay to Buy' AS type, client_id, created_at FROM stays_to_buy
                   UNION ALL
                   SELECT id, title, city, price, 'Stay to Rent' AS type, client_id, created_at FROM stays_to_rent
                   UNION ALL
                   SELECT id, title, city, price, 'Land' AS type, client_id, created_at FROM land
                   UNION ALL
                   SELECT id, title, preferred_city AS city, budget AS price, 'Wanted' AS type, client_id, created_at FROM wanted
                 ) p
                 LEFT JOIN clients c ON p.client_id = c.id
                 ORDER BY p.created_at DESC
                 LIMIT 5`
            );
            recent_properties = rows;
        } catch (e) {}

        let recent_clients = [];
        try {
            const [rows] = await db.query(
                `SELECT id, full_name, email, phone_number FROM clients ORDER BY id DESC LIMIT 5`
            );
            recent_clients = rows;
        } catch (e) {}

        return res.status(200).json({
            success: true,
            data: {
                recent_properties,
                recent_clients
            }
        });

    } catch (error) {
        console.error("Get Recent Activity Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch recent activity"
        });
    }
};
