const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  gr_no: {
    type: String,
    unique: true,
  },
  year: {
    type: Number,
    max: 4,
    min: 1,
    default: 3,
  },
  avatar: {
    type: String,
    default: "nature.png",
  },
  certificates: [
    {
      eventId: {
        type: mongoose.Types.ObjectId,
        ref: "Events",
        required: true,
      },
      eventName: String,
      eventBadge: String,
      issuedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", UserSchema);
