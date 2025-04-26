require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const chatRoutes = require("./routes/chatRoutes");
const ChatMessage = require("./models/ChatMessage");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Erro MongoDB:", err));

app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Servidor do FURIA Chat funcionando!");
});

io.on("connection", (socket) => {
  console.log("Novo usuário conectado:", socket.id);

  socket.on("load_messages", async () => {
    try {
      const messages = await ChatMessage.find().sort({ createdAt: 1 });
      socket.emit("receive_message", messages);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const { username, message } = data;

      const newMessage = new ChatMessage({ username, message });
      await newMessage.save();

      io.emit("receive_message", newMessage);
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
