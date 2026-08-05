import db from "../../configuration/db.js";

// Helper to get a valid client ID or fallback to first client
const getValidClientId = async (reqClientId) => {
    if (reqClientId) {
        const [found] = await db.query("SELECT id FROM clients WHERE id = ?", [reqClientId]);
        if (found.length) return found[0].id;
    }
    const [first] = await db.query("SELECT id FROM clients LIMIT 1");
    if (first.length) return first[0].id;
    throw new Error("No client account found. Please create a client account first.");
};



// ======================================
// GET ALL PAYMENTS (SUPER ADMIN)
// ======================================

export const getAllPayments = async (req, res) => {

    try {

        const status = req.params?.status || req.query?.status;


        let query = `

            SELECT

            p.id,
            p.client_id,
            p.property_type,
            p.property_id,
            p.amount,
            p.status,
            p.payment_method,
            p.transaction_ref,
            p.created_at,

            c.full_name AS client_name,
            c.email AS client_email

            FROM payments p

            LEFT JOIN clients c

            ON p.client_id = c.id

        `;


        let values = [];


        if (status) {

            query += ` WHERE p.status = ?`;

            values.push(status);

        }


        query += ` ORDER BY p.created_at DESC`;



        const [payments] = await db.query(
            query,
            values
        );



        res.status(200).json({

            success: true,

            count: payments.length,
            data: payments,
            payments

        });



    } catch (error) {


        console.log(error);


        res.status(500).json({

            success:false,

            message:"Server error",

            error:error.message

        });


    }

};






// ======================================
// GET SINGLE PAYMENT
// ======================================

export const getPaymentById = async (req,res)=>{


    try {


        const {id} = req.params;



        const [payments] = await db.query(

            `

            SELECT

            p.*,

            c.name AS client_name,
            c.email AS client_email


            FROM payments p


            LEFT JOIN clients c

            ON p.client_id = c.id


            WHERE p.id = ?

            `,

            [id]

        );



        if(payments.length === 0){


            return res.status(404).json({

                success:false,

                message:"Payment not found"

            });


        }



        res.json({

            success:true,

            payment:payments[0]

        });



    } catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};







// ======================================
// UPDATE PAYMENT STATUS
// ======================================

export const updatePaymentStatus = async(req,res)=>{


    try{


        const {id}=req.params;


        const {status}=req.body;



        const allowedStatus=[

            "pending",
            "paid",
            "failed",
            "refunded"

        ];



        if(!allowedStatus.includes(status)){


            return res.status(400).json({

                success:false,

                message:"Invalid payment status"

            });


        }



        await db.query(

            `

            UPDATE payments

            SET

            status=?

            WHERE id=?

            `,


            [

                status,

                id

            ]

        );



        res.json({

            success:true,

            message:"Payment status updated"

        });



    }catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};







// ======================================
// PAYMENT STATISTICS
// ======================================

export const paymentStats = async(req,res)=>{


    try{


        const [stats] = await db.query(

            `

            SELECT


            COUNT(*) AS totalPayments,


            SUM(

                CASE

                WHEN status='paid'

                THEN amount

                ELSE 0

                END

            ) AS totalRevenue,



            SUM(

                CASE

                WHEN status='pending'

                THEN 1

                ELSE 0

                END

            ) AS pendingPayments,



            SUM(

                CASE

                WHEN status='failed'

                THEN 1

                ELSE 0

                END

            ) AS failedPayments



            FROM payments


            `

        );



        res.json({

            success:true,
            data: {
                total_revenue: Number(stats[0]?.totalRevenue || 0),
                total_payments: Number(stats[0]?.totalPayments || 0),
                pending_payments: Number(stats[0]?.pendingPayments || 0),
                failed_payments: Number(stats[0]?.failedPayments || 0)
            },
            stats:stats[0]

        });



    }catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};








// ======================================
// DELETE PAYMENT
// ======================================

export const deletePayment = async(req,res)=>{


    try{


        const {id}=req.params;



        const [result] = await db.query(

            `

            DELETE FROM payments

            WHERE id=?

            `,

            [id]

        );



        if(result.affectedRows === 0){


            return res.status(404).json({

                success:false,

                message:"Payment not found"

            });


        }



        res.json({
            success:true,
            message:"Payment deleted successfully"
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};



export const createPayment = async (req, res) => {
    try {
        const {
            client_id,
            property_type,
            property_id,
            amount,
            payment_method,
            transaction_ref,
            status
        } = req.body;

        const clientId = await getValidClientId(client_id);
        const pType = property_type || "hot_sales";
        const pId = Number(property_id) || 1;
        const amt = Number(amount) || 0;

        const [result] = await db.query(
            `INSERT INTO payments (client_id, property_type, property_id, amount, payment_method, transaction_ref, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [clientId, pType, pId, amt, payment_method || "Bank Transfer", transaction_ref || `TRX-${Date.now()}`, status || "paid"]
        );

        res.status(201).json({
            success: true,
            message: "Payment created successfully",
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error("createPayment error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};