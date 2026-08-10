import multer from "multer";
import { constants } from "node:http2";

function uploadError(error, req, res, next) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Ukuran foto maksimal 2 MB",
      });
    }
  }

  if (error) {
    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }

  next();
}

export default uploadError;
