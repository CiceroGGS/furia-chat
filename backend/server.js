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

// Sistema de Torcida
let cheerCount = 0;
let cheerTimeout = null;
const resetCheerCount = () => {
  cheerCount = 0;
  io.emit("cheer_reset");
};

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: "majority",
  })
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Erro MongoDB:", err));

app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    service: "FURIA Chat Backend",
    version: "1.1.0", // Atualizada a versão
  });
});

io.on("connection", (socket) => {
  console.log(`🔌 Novo usuário conectado: ${socket.id}`);

  // Sistema de Torcida
  socket.on("send_cheer", (data) => {
    try {
      cheerCount++;

      // Notifica todos sobre o grito
      io.emit("cheer_update", {
        count: cheerCount,
        user: data.username,
        timestamp: new Date(),
      });

      // Dispara efeito especial se 3+ gritos em 5 segundos
      if (cheerTimeout) clearTimeout(cheerTimeout);
      cheerTimeout = setTimeout(resetCheerCount, 5000);

      if (cheerCount >= 3) {
        io.emit("special_event", {
          type: "mass_cheer",
          message: `🎉 ${cheerCount} FURIACOS GRITARAM JUNTOS!`,
          count: cheerCount,
        });
        resetCheerCount();
      }
    } catch (error) {
      console.error("Erro no sistema de torcida:", error);
    }
  });

  // Mantenha todos os outros eventos que você já tinha...
  socket.on("load_messages", async () => {
    /* ... */
  });
  socket.on("send_message", async (data) => {
    /* ... */
  });
  socket.on("join_match", (matchId) => {
    /* ... */
  });
  socket.on("disconnect", () => {
    /* ... */
  });
});

// Atualização de partidas (mantenha seu código existente)
setInterval(() => {
  /* ... */
}, 30000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Acesse: http://localhost:${PORT}`);
});
