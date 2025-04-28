// models/ChatMessage.js
const mongoose = require("mongoose"); // <-- Import do mongoose
const { Schema, model } = mongoose;

const chatMessageSchema = new Schema(
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
    // Novos campos
    edited: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    parentMessageId: {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
    reactions: [
      {
        userId: String,
        emoji: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("ChatMessage", chatMessageSchema);
