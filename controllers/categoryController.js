import Category from "../models/categoryModel.js";

 export const createCategory = async(req, res) => {


    try {

        const { name, type } = req.body

        if(!name){
            return res.status(400).json({
                status: false,
                message: "Category name is required",
                data: [],
            })
        }

        const newCategory = await Category.create({
            name,
            type: type || 'outfit'  // default if not provided
        });

        if(!newCategory){
            return res.status(400).json({
                status: false,
                message: "Could not create category",
                data: []
            })
        }

        res.status(201).json({
            status: true,
            message: "Category created successfully",
            data: newCategory
        })
        
    } catch (error) {
        console.error("Error creating category", error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }

}

//  Get all categories