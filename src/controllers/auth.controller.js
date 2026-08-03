import userModel from "../models/user.model.js";
import { constants } from "node:http2";
import bcrypt from "bcrypt";
import libJwt from "../lib/jwt.js";

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

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);

    if (!user) {
      return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "Email or password is invalid",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "Email or password invalid",
      });
    }

    const token = libJwt.sign({
      id: user.id,
      email: user.email,
    });

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Login success",
      token,
    });
  } catch (error) {
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email, newPassword } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "email not found",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateUser = await userModel.updatePassword(email, hashedPassword);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Password Updated Successfully",
      data: updateUser,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

export default {
  register,
  login,
  forgotPassword,
};
