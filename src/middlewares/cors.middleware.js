import { constants } from "node:http2";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {function()} next
 * @returns
 */
function coreMiddelware(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Method", "FETCH, PUT, GET, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
    return;
  }
  next();
}
