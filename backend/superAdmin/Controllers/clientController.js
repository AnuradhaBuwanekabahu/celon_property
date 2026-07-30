import db from "../../configuration/db.js";
import bcrypt from "bcrypt";

// Register Super Admin

export const registerSuperAdmin = async (req, res) => {

    try {

        const {
            full_name,
            email,
            password,
            phone_number = null,
            free_ad_limit = 3,
            second_limit = 10,
            second_limit_charge = 1500,
            third_limit = 25,
            third_limit_charge = 3000
        } = req.body;


        // Validate required fields

        if (!full_name || !email || !password) {
            return res.status(400).json({
                message: "Full name, email and password are required"
            });
        }


        // Check existing email

        const [existingAdmin] = await db.query(
            "SELECT * FROM super_admins WHERE email = ?",
            [email]
        );


        if (existingAdmin.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }


        // Hash password

        const hashedPassword = await bcrypt.hash(password, 10);


        // Insert Super Admin

        const [result] = await db.query(

            `
            INSERT INTO super_admins
            (
                full_name,
                email,
                password,
                phone_number,
                free_ad_limit,
                second_limit,
                second_limit_charge,
                third_limit,
                third_limit_charge
            )

            VALUES (?,?,?,?,?,?,?,?,?)
            `,

            [
                full_name,
                email,
                hashedPassword,
                phone_number,
                free_ad_limit,
                second_limit,
                second_limit_charge,
                third_limit,
                third_limit_charge
            ]

        );


        res.status(201).json({

            success: true,
            message: "Super Admin registered successfully",
            superAdminId: result.insertId

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server error"

        });

    }

};


// Login Super Admin

export const loginSuperAdmin = async (req, res) => {

    try {

        const { email, password } = req.body;


        const [rows] = await db.query(

            "SELECT * FROM super_admins WHERE email = ?",

            [email]

        );


        if (rows.length === 0) {

            return res.status(401).json({

                success: false,
                message: "Invalid email or password"

            });

        }


        const superAdmin = rows[0];


        // Check account status

        if (!superAdmin.is_active) {

            return res.status(403).json({

                success: false,
                message: "Your account has been deactivated."

            });

        }


        // Compare password

        const passwordMatch = await bcrypt.compare(

            password,

            superAdmin.password

        );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,
                message: "Invalid email or password"

            });

        }


        // Login Success

        res.status(200).json({

            success: true,

            message: "Login successful",

            superAdmin: {

                id: superAdmin.id,
                full_name: superAdmin.full_name,
                email: superAdmin.email,
                phone_number: superAdmin.phone_number,

                free_ad_limit: superAdmin.free_ad_limit,
                second_limit: superAdmin.second_limit,
                second_limit_charge: superAdmin.second_limit_charge,
                third_limit: superAdmin.third_limit,
                third_limit_charge: superAdmin.third_limit_charge,

                is_active: superAdmin.is_active

            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Server error"

        });

    }

};