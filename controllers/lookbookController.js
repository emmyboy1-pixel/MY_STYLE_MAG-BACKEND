import Lookbook from "../models/lookbookModels.js";
import User from "../models/userModels.js";


// create a lookbook
export const createLookbook = async(req, res) => {
    
    try {

        const { name } = req.body;
        const userId = Number(req.params.userId);

        // checking if user exist here
        const user = await User.findByPk(userId);
        if(!user){
            return res.status(404).json({
                status: false,
                message: "User not found ",
                data: []
            });
        }

        // creating lookbook
        const newLookbook = await Lookbook.create({ userId, name});

        if(!newLookbook){
            res.status(400).json({
                status: false,
                message: "Could not create the new Lookbook",
                data: [],
            })
        }

        res.status(201).json({
            message: "Lookbook created successfully",
            Lookbook: newLookbook
        });

        
    } catch (error) {
        console.error('Error creating lookbook', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}

// get all lookbooks
export const getAllLookbooks = async(req, res) => {

}