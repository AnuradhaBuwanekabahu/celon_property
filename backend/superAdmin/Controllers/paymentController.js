import db from "../../configuration/db.js";



// ======================================
// GET ALL PAYMENTS (SUPER ADMIN)
// ======================================

export const getAllPayments = async (req, res) => {

    try {

        const { status } = req.query;


        let query = `

            SELECT

            p.id,
            p.client_id,
            p.property_type,
            p.property_id,
            p.amount,
            p.status,
            p.payment_gateway,
            p.payment_method,
            p.transaction_ref,
            p.paid_at,
            p.created_at,

            c.name AS client_name,
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

            status=?,

            paid_at =
            CASE
                WHEN ?='paid'
                THEN NOW()
                ELSE paid_at
            END


            WHERE id=?

            `,


            [

                status,

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



    }catch(error){


        console.log(error);


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};