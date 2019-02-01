import jwt from "jsonwebtoken";
const dotenv = require("dotenv");

dotenv.config();

export const createToken = tokenData => {
  return jwt.sign(
    {
      userId: tokenData.userId,
      email: tokenData.userEmail
    },
    process.env.SECRET,
    {
      expiresIn: tokenData.expiryTime
    }
  );
};
