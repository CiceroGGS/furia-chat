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
        // Adicione esta seção de populate
        path: "userId",
        select: "username", // Inclua o username do author da mensagem pai
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

// Adicione este método para facilitar a busca de mensagens antigas
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
      select: "username message createdAt userId", // Inclua userId
      populate: {
        // Popule o userId da mensagem pai, se necessário.
        path: "userId",
        select: "username",
      },
    })
    .lean();
};

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
