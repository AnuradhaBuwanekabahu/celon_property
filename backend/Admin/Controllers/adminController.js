import db from "../../configuration/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ============================
// Register Admin
// ============================

export const registerAdmin = async(req,res)=>{

    try{

        const {
            Name,
            email,
            password
        } = req.body;


        if(!Name || !email || !password){

            return res.status(400).json({
                message:"All fields are required"
            });

        }



        // Check email

        const [existing] = await db.query(
            "SELECT * FROM admins WHERE email=?",
            [email]
        );


        if(existing.length>0){

            return res.status(400).json({
                message:"Email already exists"
            });

        }



        const hashedPassword = await bcrypt.hash(
            password,
            10
        );



        await db.query(

            `
            INSERT INTO admins
            (
                Name,
                email,
                password,
                role,
                is_approved
            )
            VALUES(?,?,?,?,?)
            `,

            [
                Name,
                email,
                hashedPassword,
                "admin",
                false
            ]

        );



        res.status(201).json({

            success:true,

            message:
            "Registration successful. Waiting for approval"

        });


    }
    catch(error){

        console.log(error);


        res.status(500).json({
             success: false,

            message:error.message

        });


    }

};

// ============================
// Login Admin
// ============================

export const loginAdmin = async (req, res) => {

    try {

        const {
            Name,
            password
        } = req.body;


        if (!Name || !password) {

            return res.status(400).json({
                success: false,
                message: "Username/email and password are required"
            });

        }


        const [admins] = await db.query(
            `
            SELECT *
            FROM admins
            WHERE name=? OR email=?
            `,
            [Name, Name]
        );


        if (admins.length === 0) {

            return res.status(401).json({

                success: false,
                message: "Invalid username or password"

            });

        }


        const admin = admins[0];


        // Approval check

        if (!admin.is_approved) {

            return res.status(403).json({

                success: false,

                message:
                    "Waiting for super admin approval"

            });

        }


        // Password check

        const match = await bcrypt.compare(
            password,
            admin.password
        );


        if (!match) {

            return res.status(401).json({

                success: false,
                message: "Invalid username or password"

            });

        }


        // JWT

        const token = jwt.sign(

            {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );


        res.json({

            success: true,

            token,

            admin: {

                id: admin.id,

                name: admin.name,

                email: admin.email,

                role: admin.role

            }

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ============================
// GET ADMIN PROFILE
// ============================

export const getAdminProfile = async (req, res) => {

    try {

        const adminId = req.admin.id;


        const [rows] = await db.query(
            `
            SELECT
                id,
                name,
                email,
                role,
                is_approved,
                created_at
            FROM admins
            WHERE id=?
            `,
            [adminId]
        );


        if (rows.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Admin not found"

            });

        }


        res.json({

            success: true,
            admin: rows[0]

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


// ============================
// UPDATE ADMIN PROFILE
// ============================

export const updateAdminProfile = async (req, res) => {

    try {

        const adminId = req.admin.id;


        const {
            name,
            email,
            password
        } = req.body;


        if (!name || !email) {

            return res.status(400).json({

                success: false,
                message: "Name and email are required"

            });

        }


        // Check email belongs to another admin

        const [existing] = await db.query(
            `
            SELECT id
            FROM admins
            WHERE email=? AND id!=?
            `,
            [email, adminId]
        );


        if (existing.length > 0) {

            return res.status(400).json({

                success: false,
                message: "Email already exists"

            });

        }


        // Update password if provided

        if (password && password.trim() !== "") {

            const hashedPassword =
                await bcrypt.hash(password, 10);


            await db.query(
                `
                UPDATE admins
                SET
                    name=?,
                    email=?,
                    password=?
                WHERE id=?
                `,
                [
                    name,
                    email,
                    hashedPassword,
                    adminId
                ]
            );

        } else {

            await db.query(
                `
                UPDATE admins
                SET
                    name=?,
                    email=?
                WHERE id=?
                `,
                [
                    name,
                    email,
                    adminId
                ]
            );

        }


        res.json({

            success: true,

            message:
                "Admin profile updated successfully"

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};