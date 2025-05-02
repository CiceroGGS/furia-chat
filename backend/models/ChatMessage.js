const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  emoji: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const chatMessageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    username: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    time: { type: String },
    isCommand: { type: Boolean, default: false },
    parentMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    reactions: [reactionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
