const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`DB connected -> ${conn.connection.host}`);
  } catch (err) {
    console.log(`Couldn't connect to db`);
    console.log(err);
  }
};

module.exports = connectDB;
