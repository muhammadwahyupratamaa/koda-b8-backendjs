import { constants } from "node:http2";
import addressModel from "../models/address.model.js";

async function getAll(req, res) {
  try {
    const userId = req.user.id;

    const addresses = await addressModel.getAll(userId);

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function getById(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const address = await addressModel.getById(id, userId);

    if (!address) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "address not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: address,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function create(req, res) {
  try {
    const userId = req.user.id;

    const { name, phone, address, city, province, postalCode, isPrimary } =
      req.body;

    const newAddress = await addressModel.create(userId, {
      name,
      phone,
      address,
      city,
      province,
      postalCode,
      isPrimary: Boolean(isPrimary),
    });

    return res.status(constants.HTTP_STATUS_CREATED).json({
      success: true,
      data: newAddress,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { name, phone, address, city, province, postalCode } = req.body;

    const updatedAddress = await addressModel.update(id, userId, {
      name,
      phone,
      address,
      city,
      province,
      postalCode,
    });

    if (!updatedAddress) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "address not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function remove(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deletedAddress = await addressModel.remove(id, userId);

    if (!deletedAddress) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "address not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: "address deleted successfully",
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

async function setPrimary(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const address = await addressModel.setPrimary(id, userId);

    if (!address) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "address not found",
      });
    }

    return res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      data: address,
    });
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  setPrimary,
};
