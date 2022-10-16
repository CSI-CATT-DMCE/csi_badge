const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [300, "Name cannot be more than 300 characters"],
      minlength: [3, "Name cannot be less than 3 characters"],
      required: [true, "Name field is required"],
      match: [/^[a-zA-Z ]+$/, (props) => `${props.value} is not a valid name`],
    },
    email: {
      type: String,
      trim: true,
      maxlength: [300, "Email Address cannot be more than 300 characters"],
      lowercase: true,
      unique: true,
      required: [true, "Email Address field is required"],
      match: [
        /^[\w-\.]+@[A-Za-z]+\.[A-Za-z]{2,4}$/,
        (props) => `${props.value} is not a valid email address`,
      ],
    },
    gr_no: {
      type: String,
      trim: true,
      minlength: [11, "GR no. cannot be less than 11 characters"],
      maxlength: [20, "GR no. cannot be more than 20 characters"],
      unique: true,
      required: [true, "GR no. field is required"],
      match: [
        /^[0-9]{4}[A-Z]{4}[0-9]{3}$/,
        (props) => `${props.value} is not a valid GR no.`,
      ],
    },
    year: {
      type: Number,
      minlength: [1, "Year cannot be less than 1 characters"],
      required: [true, "GR no. field is required"],
    },
    avatar: {
      type: String,
      required: [true, "Avatar field is required"],
      default: "nature.png",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.connection
  .useDb("CSI_BADGE")
  .model("User", UserSchema);
