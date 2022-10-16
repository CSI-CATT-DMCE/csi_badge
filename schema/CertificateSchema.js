const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Event ID field is required"],
    },
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Event ID field is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.connection
  .useDb("CSI_BADGE")
  .model("Certificate", CertificateSchema);
