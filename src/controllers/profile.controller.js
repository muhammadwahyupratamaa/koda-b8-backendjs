import { constants } from "node:http2";
import profileModel from "../models/profile.model.js";
import bcrypt from "bcrypt";
import { UniqueConstraintError } from "sequelize";
import cloudinary from "../config/cloudinary.js";

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

    const { name, email, phone, birthDate, gender } = req.body;

    let avatarUrl;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      avatarUrl = result.secure_url;
    }

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
    if (error instanceof UniqueConstraintError) {
      return res.status(constants.HTTP_STATUS_CONFLICT).json({
        success: false,
        message: "Email sudah digunakan",
      });
    }

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "brilianshop/profile",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(fileBuffer);
  });
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

    if (!user) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await profileModel.updatePassword(userId, hashedPassword);

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
