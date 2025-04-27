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
      type: mongoose.Schema.Types.ObjectId,
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
