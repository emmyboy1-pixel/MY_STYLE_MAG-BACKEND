import adminModel from "../models/adminModel.js";
import dotenv from 'dotenv';

dotenv.config();


const createInitialAdmin = async () => {

    try {
        
        const adminCount = await adminModel.count();
        if(adminCount === 0){

            // const hashedPassword = await bcrypt.hash('')

            await adminModel.create({
                name: "Initial Admin",
                email: process.env.INITIAL_ADMIN_EMAIL,
                password: process.env.INITIAL_ADMIN_PASSWORD,
                role: "admin"
            });
            console.log("Initial admin created successfully: ");
        }else {
            console.log("admin already exists, skipping initial admin creation: ");
        }

    } catch (error) {
        console.error("Error creating initial admin: ", error);  
    } finally{
        process.exit();
    }
};

createInitialAdmin();