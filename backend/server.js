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

// Configuração do CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use("/api/chat", chatRoutes);

// Conexão com MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Erro MongoDB:", err));

// Configuração do Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutos
    skipMiddlewares: true,
  },
});

// Handlers de Socket.IO
io.on("connection", (socket) => {
  console.log(`🔌 Novo cliente conectado: ${socket.id}`);

  // Envia as últimas 50 mensagens ao conectar
  const sendLastMessages = async () => {
    try {
      const messages = await ChatMessage.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      socket.emit("initial_messages", messages.reverse());
    } catch (error) {
      console.error("Erro ao carregar mensagens iniciais:", error);
    }
  };

  sendLastMessages();

  socket.on("send_message", async (data) => {
    try {
      if (!data.message || data.message.trim() === "") {
        throw new Error("Mensagem vazia");
      }

      const username =
        data.username || `User${Math.random().toString(36).substr(2, 5)}`;
      const newMessage = {
        message: data.message.trim(),
        username,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isCommand: data.message.startsWith("!"),
      };

      const messageDoc = new ChatMessage(newMessage);
      const savedMessage = await messageDoc.save();

      io.emit("new_message", savedMessage.toObject());
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
      socket.emit("system_message", {
        type: "ERROR",
        message: error.message || "Erro ao processar sua mensagem",
      });
    }
  });

  socket.on("send_cheer", (data) => {
    const username = data.username || "Anônimo";
    io.emit("cheer_update", {
      count: Math.floor(Math.random() * 10) + 1,
      user: username,
      type: "CHEER_UPDATE",
    });
  });

  socket.on("request_help", () => {
    socket.emit("system_message", {
      type: "HELP_RESPONSE",
      commands: [
        { command: "!cheer", description: "Envia um grito de guerra" },
        { command: "!help", description: "Mostra esta mensagem de ajuda" },
      ],
    });
  });

  socket.on("disconnect", () => {
    console.log(`⚠️ Cliente desconectado: ${socket.id}`);
  });
});

// Rota de health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    websocket: io.engine.clientsCount,
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error("❌ Erro:", err.stack);
  res.status(500).json({ error: "Algo deu errado!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Endpoints:`);
  console.log(`   - http://localhost:${PORT}/api/chat`);
  console.log(`   - http://localhost:${PORT}/health`);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});
