const ChatMessage = require("../models/ChatMessage");

// Buscar todas as mensagens
async function getMessages(req, res) {
  try {
    const messages = await ChatMessage.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar mensagens" });
  }
}

// Salvar nova mensagem
async function postMessage(req, res) {
  const { username, message } = req.body;

  try {
    const newMessage = new ChatMessage({ username, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar mensagem" });
  }
}

module.exports = {
  getMessages,
  postMessage,
};
