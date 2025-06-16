import { verifyToken } from "../utils/auth/jwt.js";
import { UnAuthenticatedErrorResponse } from "../utils/error/index.js";

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.authToken;

  if (!token) {
    throw new UnAuthenticatedErrorResponse("User Authentication Failed");
  }

  try {
    const payLoad = verifyToken({ token });
    req.user = {
      id: payLoad.id,
      name: payLoad.name,
      role: payLoad.role,
    };
    next();
  } catch (error) {
    res
      .status(401)
      .json({ status: false, message: "Authentication Failed", data: [] });
  }
};

export { authenticateUser };
