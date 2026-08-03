import { constants } from "node:http2";
import libJwt from "../lib/jwt.js";

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  console.log(req.headers.authorization);
  if (!authorization) {
    return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer") {
    return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized : missing token",
    });
  }

  if (!token) {
    return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized: token not found",
    });
  }
  try {
    const payload = libJwt.verify(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized",
    });
  }
}
export default authMiddleware;
