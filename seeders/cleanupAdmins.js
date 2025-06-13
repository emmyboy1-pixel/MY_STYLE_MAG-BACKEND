import adminModel from '../models/adminModel.js';

const cleanUpAdmins = async() => {
    try {

        // deleting all admins
        // await adminModel.destroy({ where: {} });

        await adminModel.destroy({ where: { role: 'superadmin'} });
        console.log("Database cleanup completed");
        
    } catch (error) {
        console.error("Cleanup error: ", error);
    }
}

cleanUpAdmins();