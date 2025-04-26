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
    methods: ["GET", "POST"],
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: "majority",
  })
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Erro MongoDB:", err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    service: "FURIA Chat Backend",
    version: "1.0.0",
  });
});

io.on("connection", (socket) => {
  console.log(`🔌 Novo usuário conectado: ${socket.id}`);

  socket.on("load_messages", async () => {
    try {
      const messages = await ChatMessage.find()
        .sort({ createdAt: -1 })
        .limit(50);
      socket.emit("messages_loaded", messages.reverse());
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      socket.emit("error", "Falha ao carregar mensagens");
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const { username, message } = data;

      if (!username || !message) {
        throw new Error("Dados inválidos");
      }

      const newMessage = new ChatMessage({
        username,
        message,
        socketId: socket.id,
      });

      await newMessage.save();
      io.emit("new_message", newMessage);
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error);
      socket.emit("error", "Falha ao enviar mensagem");
    }
  });

  socket.on("join_match", (matchId) => {
    socket.join(`match_${matchId}`);
    console.log(`🎮 Usuário ${socket.id} entrou na sala do jogo ${matchId}`);
  });

  // Simulador de eventos (substitua por API real depois)
  setInterval(() => {
    const events = [
      "Round 5 iniciado | FURIA 3 x 1 Opponent",
      "KSCERATO fez 2 kills!",
      "Placar atual: FURIA 7 x 5 Opponent",
    ];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    io.to("match_123").emit("live_event", {
      event: randomEvent,
      timestamp: new Date(),
    });
  }, 15000);

  socket.on("disconnect", () => {
    console.log(`⚠️ Usuário desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Acesse: http://localhost:${PORT}`);
});
