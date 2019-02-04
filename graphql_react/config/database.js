import mongoose from "mongoose";

const dotenv = require("dotenv");

dotenv.config();

const conn = mongoose.connect(process.env.DATABASE_URL);

export { conn };
