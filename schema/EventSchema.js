const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [300, "Name cannot be more than 300 characters"],
      minlength: [3, "Name cannot be less than 3 characters"],
      required: [true, "Name field is required"],
      match: [/^[a-zA-Z ]+$/, (props) => `${props.value} is not a valid name`],
    },
    date: {
      type: Date,
      required: [true, "Date field is required"],
      default: Date.now(),
    },
    badges: {
      type: String,
      required: [true, "Badges field is required"],
      default: "nature.png",
    },
    description: {
      type: String,
      trim: true,
      maxlength: [600, "Description cannot be more than 600 characters"],
      minlength: [3, "Description cannot be less than 3 characters"],
      required: [true, "Description field is required"],
    },
    short_description: {
      type: String,
      trim: true,
      maxlength: [300, "Short Description cannot be more than 300 characters"],
      minlength: [3, "Short Description cannot be less than 3 characters"],
      required: [true, "Short Description field is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.connection
  .useDb("CSI_BADGE")
  .model("Event", EventSchema);
