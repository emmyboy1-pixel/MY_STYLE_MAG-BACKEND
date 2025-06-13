import adminModel from "../models/adminModel.js";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from "cloudinary";
import jwt from 'jsonwebtoken';
import tagModel from '../models/tagModel.js';
import OutfitModel from "../models/outfitModel.js";
import CategoryModels from "../models/categoryModel.js";
import dotenv from 'dotenv';
import validator from "validator";
import { sequelize } from "../config/dbConfig.js";
dotenv.config();

export const registerAdmin = async(req, res) => {
    try {

        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                status: false,
                message: "Missing required fields",
                data: []
            });
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({
                status: false,
                message: 'Invalid email',
                data: []
            });
        }

        // check if admin exist
        const existingAdmin = await adminModel.findOne({ where: { email }});
        if(existingAdmin){
            return res.status(400).json({
                status: false,
                message: "Admin already exist",
                data: []
            });
        }

        // creating admin
        const admin = await adminModel.create({ name, email, password});
        
        res.status(201).json({
            status: true,
            message: "Admin registered successfully",
            data: admin,
        });
               
    } catch (error) {
        console.error("Registration error: ", error);
        res.status(500).json({
            status: false,
            message: "Internal server Error: ",
            error: error.message
        });
    }
}

// API for Admin Login
export const adminLogin = async(req, res) => {
    try {
        const { email , password} = req.body;
         
       // finding admin instead in database
       const admin = await adminModel.findOne({ where: { email }});
       if(!admin){
        return res.status(401).json({status: false, message: "Invalid credentials", data: [] });
       }


       // comparing hashed password
       const isMatch = await bcrypt.compare(password, admin.password);
       if(!isMatch){
        return res.status(401).json({ status: false, message: "Invalid credentials", data: [] });
       }
       // generating secure jwt
       const token = jwt.sign(
        { id: admin.id, role: admin.role }, // payload
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
       )
       res.status(200).json({
        status: true,
        token
       });
    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({
            status: false,
            message: "Server error"
        });
    }
}

export const uploadOutfits = async(req, res) => {
    const transaction = await sequelize.transaction();  // if anything fails either uploading, every other thing should stop keeping our database clean

    try {

        // verifying admin status is true
        if(!req.user || req.user.role !== 'admin'){
            return res.status(403).json({
                status: false,
                message: "Admin privileges required",
                data: []
            });
        }

        const { title, tags: tagsInput, categoryId } = req.body;
        const imageFile = req.file;
         
        if(!title || !tagsInput || !categoryId || !imageFile){
            res.status(400).json({
                status: false,
                message: "Title, tags, category, and image are required",
                data: [],
            });
        }

        // category
        const category = await CategoryModels.findByPk(categoryId, { transaction });
        if(!category){
            return res.status(404).json({
                status: false,
                message: "Category Id not found",
                data: []
            });
        }

        const tagNames = tagsInput.split(',').map(tag => tag.trim());
        const tagRecords = await Promise.all(
            tagNames.map(tagName =>
                tagModel.findOrCreate({
                    where: { name: tagName },
                    defaults: { name: tagName },
                    transaction
                })
            )
        );

        const tags = tagRecords.map(record => record[0]);

        // image upload to cloudinary(with fallback mechanism)
        let imageUrl;
        try {
            const uploadResult = await cloudinary.uploader.upload(imageFile.path );
            imageUrl = uploadResult.secure_url;
        } catch (uploadError) {
            console.error("Cloud upload failed: ", uploadError);
            return res.status(500).json({
                status: false,
                message: "image upload failed",
                data: []
            });
        }

        // outfits creation
        const outfit = await OutfitModel.create({
            title, imageUrl, categoryId: category.id, createdBy: req.user.id
        },
        { transaction }
        );

        // linking tags to our outfits (associating)
        await outfit.addTags(tags, { transaction });

        await transaction.commit();

        return res.status(201).json({
            status: true,
            message: "Outfit created successfully",
            data: {
                ...outfit.get({ plain: true }),
                tags: tags.map(tag => tag.name),
                category: category.name
            }
        });
         
    } catch (error) {

        await transaction.rollback();
        console.error("Admin outfit creation error: : ", error);
        res.status(500).json({
            status: false,
            message: "Server error during outfit creation",
            error: error.massage
        });
    }
}


 