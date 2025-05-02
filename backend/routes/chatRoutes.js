const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const ChatMessage = require("../models/ChatMessage");

module.exports = (io) => {
  // Enviar mensagem (via HTTP POST)
  router.post("/", protect, async (req, res) => {
    try {
      const messageData = {
        ...req.body,
        userId: req.user._id,
        username: req.user.username,
        time: new Date().toLocaleTimeString(),
      };

      const message = new ChatMessage(messageData);
      const savedMessage = await message.save();

      // Emitir via Socket.IO após salvar
      io.emit("new_message", savedMessage);

      res.status(201).json(savedMessage);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Editar mensagem
  router.patch("/:id", protect, async (req, res) => {
    try {
      const message = await ChatMessage.findByIdAndUpdate(
        req.params.id,
        {
          message: req.body.content,
          edited: true,
        },
        { new: true }
      );

      if (!message) {
        return res.status(404).json({ error: "Mensagem não encontrada" });
      }

      io.emit("update_message", message);
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Adicionar reação
  router.post("/:id/react", protect, async (req, res) => {
    try {
      const message = await ChatMessage.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            reactions: {
              userId: req.user._id,
              emoji: req.body.emoji,
            },
          },
        },
        { new: true }
      );

      io.emit("update_message", message);
      res.json(message.reactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
