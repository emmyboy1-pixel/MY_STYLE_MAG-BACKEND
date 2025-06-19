// TODO: Implement user controller endpoints.
import User from '../models/user.model.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // do not return password hashes
    });

    res.status(200).json({
      status: true,
      message: 'All users fetched successfully',
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};