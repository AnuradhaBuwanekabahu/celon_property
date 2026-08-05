import jwt from "jsonwebtoken";
import db from "../../configuration/db.js";



const superAdminAuthMiddleware = async (req, res, next) => {


    try {


        const authHeader = req.headers.authorization;



        if (!authHeader) {


            return res.status(401).json({

                success:false,

                message:"No token provided"

            });

        }




        const token = authHeader.split(" ")[1];



        if(!token){


            return res.status(401).json({

                success:false,

                message:"Invalid token format"

            });


        }




        // Verify JWT

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );



        req.admin = decoded;



        // Check Super Admin Role


        const [admins] = await db.query(
            `
            SELECT
            id,
            Name,
            email,
            role,
            is_approved
            FROM admins
            WHERE id=?
            `,
            [
                decoded.id
            ]
        );

        if(admins.length===0){
            return res.status(401).json({
                success:false,
                message:"Admin not found"
            });
        }

        const admin = admins[0];

        if (admin.role !== "super_admin" && admin.role !== "admin") {
            return res.status(403).json({
                success:false,
                message:"Access denied. Admin access required."
            });
        }

        if(admin.is_approved !== 1){
            return res.status(403).json({
                success:false,
                message:"Admin account is inactive"
            });
        }




        req.admin = admin;



        next();



    }

    catch(error){


        console.log(error);



        return res.status(401).json({

            success:false,

            message:"Invalid or expired token"

        });


    }


};



export default superAdminAuthMiddleware;