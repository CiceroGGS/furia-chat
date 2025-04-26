const express = require("express");
const ChatMessage = require("../models/ChatMessage");
const router = express.Router();

// GET todas as mensagens (últimas 50)
router.get("/", async (req, res) => {
  try {
    const messages = await ChatMessage.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({
      error: "Erro ao carregar mensagens",
      details: error.message,
    });
  }
});

// POST nova mensagem
router.post("/", async (req, res) => {
  try {
    const messageData = {
      ...req.body,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isCommand: req.body.message.startsWith("!"),
    };

    const message = new ChatMessage(messageData);
    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao salvar mensagem",
      details: error.message,
    });
  }
});

module.exports = router;
