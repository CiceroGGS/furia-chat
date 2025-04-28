require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("./models/user");

const chatRoutes = require("./routes/chatRoutes");
const liveMatchRoutes = require("./routes/liveMatchRoutes");
const authRoutes = require("./routes/authRoutes");
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
app.use("/api/chat", chatRoutes);
app.use("/api/match-live", liveMatchRoutes);
app.use("/api/auth", authRoutes);

// Conexão MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Erro MongoDB:", err));

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
});

// Middleware do Socket.IO para autenticação
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Não autorizado: Nenhum token fornecido."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new Error("Não autorizado: Usuário não encontrado."));
    }

    // Armazene as informações do usuário no objeto socket para uso posterior
    socket.user = user;
    next(); // Permite a conexão
  } catch (error) {
    return next(new Error(`Não autorizado: Token inválido. ${error.message}`));
  }
});

io.on("connection", (socket) => {
  console.log(
    `🔌 Novo cliente autenticado: ${socket.id}, Username: ${socket.user.username}`
  );

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

  socket.on("send_message", async (data) => {
    try {
      if (!data.message.trim()) throw new Error("Mensagem vazia");
      const doc = new ChatMessage({
        message: data.message.trim(),
        username: socket.user.username, // Use o username do usuário autenticado
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isCommand: data.message.startsWith("!"),
        parentMessageId: data.parentMessageId,
        userId: socket.user._id, // Associe o ID do usuário autenticado à mensagem
      });
      const saved = await doc.save();
      io.emit("new_message", saved.toObject());
    } catch (err) {
      console.error("Erro ao processar mensagem:", err);
      socket.emit("system_message", { type: "ERROR", message: err.message });
    }
  });

  socket.on("send_cheer", ({ username }) => {
    const count = Math.floor(Math.random() * 5) + 1;
    io.emit("cheer_update", { count, user: socket.user.username || "Anônimo" }); // Use o username autenticado
  });

  socket.on("disconnect", () => {
    console.log(
      `⚠️ Desconectado: ${socket.id}, Username: ${socket.user?.username}`
    );
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    websocket: io.engine.clientsCount,
  });
});

app.use((err, req, res, next) => {
  console.error("❌ Erro:", err.stack);
  res.status(500).json({ error: "Algo deu errado!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});
