import Outfit from "../models/outfitModel.js";
import Category from "../models/categoryModel.js";
import User from "../models/userModels.js";
import Tag from "../models/tagModel.js";

export const createOutfit = async(req, res) => {

    try {

        const { title, description, imageUrl, categoryId } = req.body;
        const createdBy = req.user.id;   

        // validating if category exists
        const category = await Category.findByPk(categoryId);

        if(!category){
            return res.status(404).json({
                error: 'Category not found'
            })
        }

        // creating the outfit
        const outfit = await Outfit.create({title, description, imageUrl, categoryId, createdBy});

        if(!outfit){
            res.status(400).json({
                status: false,
                message: "Could not create the outfit",
                data: [],
            })
        }

        res.status(201).json({
            status: true,
            message: "Outfit created successfully",
            data: outfit
        });
        
    } catch (error) {
        console.error("Error creating the outfit: ", error);
        res.status(500).json({
            error: 'Internal server error occured',
            details: error.message
        });
    }
}

//  get outfit