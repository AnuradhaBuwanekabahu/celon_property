import db from "../../configuration/db.js";
import bcrypt from "bcrypt";


export const registerClient = async (req, res) => {

    try {
        

        const {
            full_name,
            email,
            password,
            phone_number = null,
            whatsapp_number = null
        } = req.body;


        // Validate required fields

        if (!full_name || !email || !password) {
            return res.status(400).json({
                message: "Full name, email and password are required"
            });
        }


        // Check existing email

        const [existingClient] = await db.query(
            "SELECT * FROM clients WHERE email = ? ", [email]
        );


        if (existingClient.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }


        // Hash password

        const hashedPassword = await bcrypt.hash(password, 10);



        // Generate username if not provided
        const username = req.body.username || email.split('@')[0] + '_' + Math.floor(1000 + Math.random() * 9000);

        // Insert client
        const [result] = await db.query(
            `
            INSERT INTO clients
            (
                username,
                password,
                email,
                phone_number,
                whatsapp_number,
                full_name
            )
            VALUES (?,?,?,?,?,?)
            `,
            [
                username,
                hashedPassword,
                email,
                phone_number,
                whatsapp_number,
                full_name
            ]
        );


        res.status(201).json({
            message: "Client registered successfully",
            clientId: result.insertId
        });



    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }

};

//login client


export const loginClient = async (req, res) => {

    try {

        const { email, password } = req.body;

        const [rows] =await  db.query(
            "SELECT * from clients where email = ?", [email]
        );


        if (rows.length === 0) {

            return res.status(401).json({
                success: false,
                message: "invalind username or password"
            })
        }


        const client = rows[0]

        //check client is approve or not

        if (!client.is_active) {


            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated. Please contact support."
            })
        }


        const passwordMatch = await bcrypt.compare(
            password,
            client.password
        )

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            })
        }

        //login successful

        res.status(200).json({
            success: true,
            message: "Login successful",
            client: {
                id: client.id,
                full_name: client.full_name,
                email: client.email,
                phone_number: client.phone_number,
                whatsapp_number: client.whatsapp_number,
                is_active: client.is_active
            }
        })
 
    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        }); 

    }

}