import jwt from "jsonwebtoken";

const generateAccessToken = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const verifyAccessToken = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToResponse = ({ res, user }) => {
  const accessToken = generateAccessToken({ payload: user });

  const sevenDays = 1000 * 60 * 60 * 168;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + sevenDays),
    secure: process.env.NODE_ENV === "production",
    signed: true,
    sameSite: "None",
  });
};

export { verifyAccessToken, attachCookiesToResponse };
