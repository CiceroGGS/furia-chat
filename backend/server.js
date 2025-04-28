// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const chatRoutes = require("./routes/chatRoutes");
const liveMatchRoutes = require("./routes/liveMatchRoutes");
const ChatMessage = require("./models/ChatMessage");

const app = express();
const server = http.createServer(app);

// CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Logging simples
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
// Rotas REST
app.use("/api/chat", chatRoutes);
app.use("/api/match-live", liveMatchRoutes);

// Conexão MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Erro MongoDB:", err));

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 Novo cliente: ${socket.id}`);

  // envia últimas 50 mensagens
  (async () => {
    try {
      const msgs = await ChatMessage.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      socket.emit("initial_messages", msgs.reverse());
    } catch (e) {
      console.error("Erro ao carregar iniciais:", e);
    }
  })();

  // mensagem normal
  socket.on("send_message", async (data) => {
    try {
      if (!data.message.trim()) throw new Error("Mensagem vazia");
      let username =
        data.username || `User${Math.random().toString(36).slice(2, 7)}`;
      const doc = new ChatMessage({
        message: data.message.trim(),
        username,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isCommand: data.message.startsWith("!"),
        parentMessageId: data.parentMessageId, // ADICIONE ESTA LINHA
      });
      const saved = await doc.save();
      io.emit("new_message", saved.toObject());
    } catch (err) {
      console.error("Erro ao processar mensagem:", err);
      socket.emit("system_message", { type: "ERROR", message: err.message });
    }
  });

  // cheer
  socket.on("send_cheer", ({ username }) => {
    const count = Math.floor(Math.random() * 5) + 1;
    io.emit("cheer_update", { count, user: username || "Anônimo" });
  });

  socket.on("disconnect", () => {
    console.log(`⚠️ Desconectado: ${socket.id}`);
  });
});

// health-check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    websocket: io.engine.clientsCount,
  });
});

// erro global
app.use((err, req, res, next) => {
  console.error("❌ Erro:", err.stack);
  res.status(500).json({ error: "Algo deu errado!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});
