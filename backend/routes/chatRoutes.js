// backend/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const ChatMessage = require("../models/ChatMessage");

// Middleware para verificar dono da mensagem
const checkMessageOwner = async (req, res, next) => {
  try {
    const message = await ChatMessage.findById(req.params.id);
    if (!message) {
      console.log(
        "checkMessageOwner: Mensagem não encontrada para ID:",
        req.params.id
      );
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }
    if (message.userId.toString() !== req.user.userId) {
      console.log(
        "checkMessageOwner: Ação não autorizada para usuário:",
        req.user.userId,
        "e mensagem de:",
        message.userId
      );
      return res.status(403).json({ error: "Ação não autorizada" });
    }
    req.message = message;
    next();
  } catch (error) {
    console.error("checkMessageOwner: Erro:", error);
    res.status(500).json({ error: error.message });
  }
};

// Buscar mensagens antigas
router.get("/", authenticateToken, async (req, res) => {
  try {
    const messages = await ChatMessage.getRecentMessages();
    console.log(
      "Buscar mensagens antigas: Sucesso, número de mensagens:",
      messages.length
    );
    res.json(messages.reverse()); // Ordena do mais antigo para o mais novo
  } catch (error) {
    console.error("Buscar mensagens antigas: Erro:", error);
    res.status(500).json({ error: error.message });
  }
});

// Editar mensagem
router.patch("/:id", authenticateToken, checkMessageOwner, async (req, res) => {
  try {
    const { message: newContent } = req.body;
    console.log(
      "Editar mensagem: Tentando editar ID:",
      req.params.id,
      "para:",
      newContent
    );
    const updatedMessage = await ChatMessage.findByIdAndUpdate(
      req.params.id,
      { message: newContent, edited: true },
      { new: true }
    ).populate("userId", "username");

    if (updatedMessage) {
      console.log(
        "Editar mensagem: Sucesso, mensagem atualizada:",
        updatedMessage
      );
      req.io.emit("update_message", updatedMessage);
      res.json(updatedMessage);
    } else {
      console.log(
        "Editar mensagem: Falha ao atualizar mensagem com ID:",
        req.params.id
      );
      res.status(404).json({ error: "Mensagem não encontrada para edição" });
    }
  } catch (error) {
    console.error("Editar mensagem: Erro:", error);
    res.status(500).json({ error: error.message });
  }
});

// Deletar mensagem
router.delete(
  "/:id",
  authenticateToken,
  checkMessageOwner,
  async (req, res) => {
    try {
      console.log("Deletar mensagem: Tentando deletar ID:", req.params.id);
      const deletedMessage = await ChatMessage.findByIdAndDelete(req.params.id);
      if (deletedMessage) {
        console.log(
          "Deletar mensagem: Sucesso, mensagem deletada com ID:",
          req.params.id
        );
        req.io.emit("delete_message", { _id: req.params.id });
        res.json({ success: true });
      } else {
        console.log(
          "Deletar mensagem: Falha ao encontrar mensagem para deletar com ID:",
          req.params.id
        );
        res.status(404).json({ error: "Mensagem não encontrada para deletar" });
      }
    } catch (error) {
      console.error("Deletar mensagem: Erro:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Adicionar reação
router.post("/:id/react", authenticateToken, async (req, res) => {
  try {
    const { emoji } = req.body;
    console.log(
      "Adicionar reação: Tentando adicionar:",
      emoji,
      "para ID:",
      req.params.id,
      "por usuário:",
      req.user.userId
    );
    const message = await ChatMessage.findById(req.params.id);

    if (!message) {
      console.log(
        "Adicionar reação: Mensagem não encontrada para ID:",
        req.params.id
      );
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }

    // Remove reação existente do mesmo usuário
    message.reactions = message.reactions.filter(
      (r) => r.userId.toString() !== req.user.userId
    );

    // Adiciona nova reação
    message.reactions.push({
      userId: req.user.userId,
      emoji,
    });

    const updatedMessage = await message.save();
    console.log(
      "Adicionar reação: Sucesso, reação adicionada:",
      updatedMessage.reactions
    );
    req.io.emit("update_message", updatedMessage);
    res.json(updatedMessage);
  } catch (error) {
    console.error("Adicionar reação: Erro:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
