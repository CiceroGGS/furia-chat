require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Models
const ChatMessage = require("./models/ChatMessage");

// Routes
const chatRoutes = require("./routes/chatRoutes");
const liveMatchRoutes = require("./routes/liveMatchRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);

// Configurações
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Erro MongoDB:", err));

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Autenticação necessária"));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error("Token inválido"));
    socket.user = decoded;
    next();
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/match-live", liveMatchRoutes);

// Eventos Socket.IO
io.on("connection", (socket) => {
  console.log(`🔌 Novo usuário conectado: ${socket.user.username}`);

  socket.on("send_message", async (messageData, callback) => {
    console.log("Mensagem send_message recebida:", messageData);
    try {
      const newMessage = new ChatMessage({
        ...messageData,
        userId: socket.user.userId,
        username: socket.user.username,
      });

      const savedMessage = await newMessage.save();

      const populatedMessage = await ChatMessage.findById(savedMessage._id)
        .populate({
          path: "parentMessageId",
          select: "username message userId",
          populate: {
            path: "userId",
            select: "username",
          },
        })
        .lean();

      io.emit("new_message", populatedMessage);
      callback({ status: "success" });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      callback({ status: "error", message: error.message });
    }
  });

  socket.on("edit_message", async ({ messageId, newContent }, callback) => {
    try {
      const message = await ChatMessage.findById(messageId);
      if (!message)
        return callback({
          status: "error",
          message: "Mensagem não encontrada",
        });

      if (!message.userId.equals(socket.user.userId)) {
        return callback({
          status: "error",
          message: "Você não pode editar essa mensagem",
        });
      }

      message.message = newContent;
      message.edited = true;
      await message.save();

      io.emit("message_edited", message);
      callback({ status: "success", message });
    } catch (error) {
      console.error("Erro ao editar mensagem:", error);
      callback({ status: "error", message: error.message });
    }
  });

  socket.on("reply_message", async ({ parentMessageId, content }, callback) => {
    try {
      const reply = new ChatMessage({
        message: content,
        userId: socket.user.userId,
        username: socket.user.username,
        parentMessageId,
      });

      const saved = await reply.save();
      io.emit("new_message", saved);
      callback({ status: "success", message: saved });
    } catch (error) {
      console.error("Erro ao responder mensagem:", error);
      callback({ status: "error", message: error.message });
    }
  });

  socket.on("react_message", async ({ messageId, emoji }, callback) => {
    try {
      const message = await ChatMessage.findById(messageId);
      if (!message)
        return callback({
          status: "error",
          message: "Mensagem não encontrada",
        });

      const existingReactionIndex = message.reactions.findIndex(
        (r) => r.userId.toString() === socket.user.userId && r.emoji === emoji
      );

      if (existingReactionIndex >= 0) {
        message.reactions.splice(existingReactionIndex, 1);
      } else {
        message.reactions.push({ userId: socket.user.userId, emoji });
      }

      await message.save();
      io.emit("message_reacted", message);
      callback({ status: "success", message });
    } catch (error) {
      console.error("Erro ao reagir à mensagem:", error);
      callback({ status: "error", message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ Usuário desconectado: ${socket.user.username}`);
  });
});

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/match-live", liveMatchRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "online",
    mongo: mongoose.connection.readyState === 1,
    usersConnected: io.engine.clientsCount,
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
