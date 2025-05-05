const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const chatMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatMessage",
      populate: {
        path: "userId",
        select: "username",
      },
    },
    edited: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    reactions: [reactionSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

chatMessageSchema.statics.getRecentMessages = async function (limit = 50) {
  return this.find({ deleted: false })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate({
      path: "userId",
      select: "username",
    })
    .populate({
      path: "parentMessageId",
      select: "username message createdAt userId",
      populate: {
        path: "userId",
        select: "username",
      },
    })
    .lean();
};

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
