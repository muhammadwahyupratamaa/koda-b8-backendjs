import { constants } from "node:http2";
import profileModel from "../models/profile.model.js";
import bcrypt from "bcrypt";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const profile = await profileModel.getProfile(userId);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { name, email, phone, birthDate, gender, avatarUrl } = req.body;
    const profile = await profileModel.updateProfile(
      userId,
      name,
      email,
      phone,
      birthDate,
      gender,
      avatarUrl,
    );

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Update Profile Successfully",
      data: profile,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async function updatePassword(req, res) {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const user = await profileModel.getPassword(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "old password is incorrect",
      });
    }
    const hashedpassword = await bcrypt.hash(newPassword, 10);
    await profileModel.updatePassword(userId, hashedpassword);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "Update password Successfully",
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

export default {
  getProfile,
  updateProfile,
  updatePassword,
};
