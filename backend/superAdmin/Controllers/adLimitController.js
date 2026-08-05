import db from "../../configuration/db.js";


// Get limits
export const getAdLimits = async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT * FROM ad_limits LIMIT 1"
        );


        res.status(200).json({

            success:true,
            limits: rows[0]

        });


    } catch(error) {

        console.log(error);

        res.status(500).json({

            success:false,
            message:"Server error"

        });

    }

};



// Update limits
export const updateAdLimits = async (req,res)=>{

    try {

        const {
            free_ad_limit,
            second_limit,
            second_limit_charge,
            third_limit,
            third_limit_charge
        } = req.body;



        await db.query(
            `
            UPDATE ad_limits
            SET
            free_ad_limit=?,
            second_limit=?,
            second_limit_charge=?,
            third_limit=?,
            third_limit_charge=?
            WHERE id=1
            `,
            [
                free_ad_limit,
                second_limit,
                second_limit_charge,
                third_limit,
                third_limit_charge
            ]
        );


        res.status(200).json({

            success:true,
            message:"Ad limits updated successfully"

        });



    } catch(error){

        console.log(error);

        res.status(500).json({

            success:false,
            message:"Server error"

        });

    }

};