const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      maxlength: [300, "User Name cannot be more than 300 characters"],
      minlength: [3, "User Name cannot be less than 3 characters"],
      required: [true, "User Name field is required"],
      match: [/^[a-zA-Z@. ]+$/, (props) => `${props.value} is not a valid name`],
    },
    password: {
      type: String,
      trim: true,
      maxlength: [12, "Password cannot be more than 12 characters"],
      minlength: [3, "Password cannot be less than 3 characters"],
      required: [true, "Password field is required"],
      match: [/^[a-zA-Z ]+$/, (props) => `${props.value} is not a valid name`],
    },
    name: {
      type: String,
      trim: true,
      maxlength: [300, "Name cannot be more than 300 characters"],
      minlength: [3, "Name cannot be less than 3 characters"],
      required: [true, "Name field is required"],
      match: [/^[a-zA-Z ]+$/, (props) => `${props.value} is not a valid name`],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.connection
  .useDb("CSI_BADGE")
  .model("Admin", AdminSchema);
