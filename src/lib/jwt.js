import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_KEY;

function sign(payload) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "1d",
  });
}
function verify(token) {
  return jwt.verify(token, SECRET);
}

const libJwt = { sign, verify };

export default libJwt;
