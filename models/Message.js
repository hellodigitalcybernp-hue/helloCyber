const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    service: { type: String, default: "General Inquiry" }, // service title at time of submission
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    note: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "in_progress", "completed", "cancelled"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
