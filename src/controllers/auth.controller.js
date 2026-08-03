import userModel from "../models/user.model.js";
import { constants } from "node:http2";
import bcrypt from "bcrypt";

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(constants.HTTP_STATUS_CONFLICT).json({
        success: false,
        message: "Email already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create(name, email, hashedPassword);

    res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

export default {
  register,
};
