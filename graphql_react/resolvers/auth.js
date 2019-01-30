import bcrypt from "bcryptjs";
import User from "../models/user";
import { createToken } from "../helpers/utils";

const dotenv = require("dotenv");

dotenv.config();

export const createUser = async args => {
  try {
    const existingUser = await User.findOne({ email: args.userInput.email });
    if (existingUser) {
      throw new Error("User Already Exist!");
    }

    const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

    const user = new User({
      email: args.userInput.email,
      password: hashedPassword
    });

    const result = await user.save();
    return {
      ...result._doc,
      _id: result.id
    };
  } catch (err) {
    throw err;
  }
};

// export const login = async ({ email, password }) => {
//   try {
//       const checkUserExist = await User.findOne({ email: email });
//       if (!checkUserExist) {
//         throw new Error("User does not exist!");
//       }

//       const checkUserPassword = await bcrypt.compare(
//         password,
//         checkUserExist.password
//       );
//       if (!checkUserPassword) {
//         throw new Error("Password is incorrect!");
//       }

//       const token = await createToken({
//         userId: checkUserExist.id,
//         userEmail: email,
//         expiryTime: "2h"
//       });

//       return {
//         userId: checkUserExist.id,
//         token,
//         tokenExpiration: expiryTime
//       };
// } catch (err) {
//   throw err;
// }
// };
