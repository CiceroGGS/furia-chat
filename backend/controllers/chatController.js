const ChatMessage = require("../models/ChatMessage");

const getMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    res.status(500).json({ message: "Erro ao buscar mensagens", error });
  }
};

const postMessage = async (req, res) => {
  try {
    const { username, message } = req.body;

    const newMessage = new ChatMessage({
      username,
      message,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error);
    res.status(500).json({ message: "Erro ao salvar mensagem", error });
  }
};

module.exports = {
  getMessages,
  postMessage,
};
