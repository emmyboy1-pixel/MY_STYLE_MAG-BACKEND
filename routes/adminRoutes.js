import express from 'express';
import { authAdmin } from '../middleware/authAdminMiddleware.js';
import { registerAdmin, adminLogin, uploadOutfits } from '../controllers/adminController.js';
import upload from '../middleware/multer.js';


const adminRouter = express.Router();

// public
adminRouter.post('/login', adminLogin);

// Protected and requires superAdmin JWT
adminRouter.post('/register', authAdmin, registerAdmin);

adminRouter.post('/outfits', authAdmin, upload.single('image'), uploadOutfits)


export default adminRouter;