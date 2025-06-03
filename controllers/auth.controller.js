import User from "../models/userModels.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingEmail = await User.findOne({ where: { email: email } });

  if (existingEmail) {
    res
      .status(404)
      .json({ status: false, message: "Email already in use", data: [] });
  }

  const hashed_password = bcrypt.hashSync(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed_password,
    role,
  });

  if (!user) {
    res.status(500).json({
      status: false,
      message: "Registration error",
      data: [],
    });
  }

  res.status(201).json({
    status: true,
    message: "User created successfully",
    data: [],
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const errorMessage = "Wrong username or password";

  const existingUser = await User.findOne({ where: { email: email } });

  if (!existingUser) {
    res.status(401).json({ status: false, message: errorMessage, data: [] });
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    res.status(401).json({ staus: false, message: errorMessage, data: [] });
  }

  // Remove password from user data
  const { password: savedPassword, ...tokenUser } = existingUser.dataValues;
  // TODO: JWT based authentication.

  res.status(200).json({
    status: true,
    message: "User Login Successfully",
    data: tokenUser,
  });
};

const logout = () => {};

// TODO: forgotPassword, verifyResetToken, and changePassword.

export { register, login };
