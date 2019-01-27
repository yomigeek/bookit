import mongoose from 'mongoose';

const dotenv = require('dotenv');

dotenv.config();


const conn = mongoose.connect(process.env.DATABASE_URL)
.then(() => {
  console.log(`Database connected!`);
})
.catch((err => {
  console.log(err);
}));

export { conn };
