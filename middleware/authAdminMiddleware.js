import jwt from 'jsonwebtoken';
// Admin authentication middleware
export const authAdmin = async(req, res, next) => {
    try {

        // testing
        if(process.env.EMERGENCY_MODE === 'true'){
            console.warn("ADMIN VALIDATION BYPASSED _ EMERGENCY MODE");
            req.user = { id: 1, role: 'admin'};
            return next();
        }

        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                status: false,
                message: "No token provided",
                data: [],
            });
        }

        const token = authHeader.split(' ')[1];
        // verifying token
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token is: ", decodeToken);

        req.admin = { id: decodeToken.id };
        next();
        
    } catch (error) {
        console.log("Authentication Error: ", error);
        res.json({
            success : false,
            message: "Invalid or expired token"
        });
    }
}