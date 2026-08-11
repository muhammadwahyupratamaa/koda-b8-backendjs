import { constants } from "node:http2";

function adminMiddleware(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(constants.HTTP_STATUS_FORBIDDEN).json({
      success: false,
      message: "Forbidden: admin access required",
    });
  }

  next();
}

export default adminMiddleware;