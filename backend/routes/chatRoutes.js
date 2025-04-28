const express = require("express");
const ChatMessage = require("../models/ChatMessage");
const router = express.Router();

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

router.patch("/:id", async (req, res) => {
  try {
    const message = await ChatMessage.findByIdAndUpdate(
      req.params.id,
      {
        message: req.body.content,
        edited: true,
      },
      { new: true }
    );

    if (!message)
      return res.status(404).json({ error: "Mensagem não encontrada" });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Erro ao editar mensagem" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const message = await ChatMessage.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );

    if (!message)
      return res.status(404).json({ error: "Mensagem não encontrada" });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir mensagem" });
  }
});

router.post("/:id/react", async (req, res) => {
  try {
    const message = await ChatMessage.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          reactions: {
            userId: req.body.userId,
            emoji: req.body.emoji,
          },
        },
      },
      { new: true }
    );

    res.json(message.reactions);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar reação" });
  }
});

module.exports = router;
