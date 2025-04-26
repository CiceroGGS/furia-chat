const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      default: "Anônimo",
    },
    time: String,
    isCommand: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index para melhor performance
chatMessageSchema.index({ username: 1 });
chatMessageSchema.index({ createdAt: 1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
