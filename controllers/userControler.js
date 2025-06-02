import User from "../models/userModels.js";
import validator from "validator";
import bcrypt from 'bcrypt';

// creating a user
// export const createUser = async (req, res) => {

//     try {
//         const { name, email, password, role } = req.body;

//         if( !name || !email || !password){
//             return res.status(400).json({
//                 success: false,
//                 message: "Missing Details"
//             })
//         }

        
//     } catch (error) {
        
//     }
// }

export const createUser = async(req, res) => {
    const { name, email, password, role } = req.body;

    const checkEmail = await User.findOne({ where: { email }});

    if(checkEmail){
        return res.status(404).json({
            status: false,
            message: "Email has been used",
            data: [],
        })
    }

    const hashed_password = bcrypt.hashSync(password, 10);

    const user = await User.create({ email, name, role, password: hashed_password});

    if(!user){
        return res.status(400).json({
            status: false,
            message: "Could not create the user",
            data: [],
        });
    }

    return res.status(201).json({
        status: true,
        message: "User created successfully",
        data: user,
    });
}

//   #####  LOGIN USER

export const loginUser = async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({ where: { email}});

    if (!user) {
        return res.status(404).json({
          status: false,
          message: "Invalid Email or Password",
          data: [],
        });
    }

    // to be continued

}