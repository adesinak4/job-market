require("dotenv").config();
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;
const refreshKey = process.env.REFRESH_TOKEN_SECRET;

const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: "5m" });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, refreshKey, {expiresIn: "30d"})
}

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new Error("Token is not valid");
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, refreshKey);
  } catch (error) {
    return null;
  }
};


module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
