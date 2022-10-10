const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter event name"],
  },
  date: {
    type: Date,
    default: "2021-01-01",
  },
  badge: {
    type: String,
    default: "nature.png",
  },
  description: String,
  shortDescription: {
    type: String,
    maxLength: [100, "Short description should be of 100 or less words"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Event", EventSchema);
