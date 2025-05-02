require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chatRoutes"); // Importando a função que retorna as rotas
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const ChatMessage = require("./models/ChatMessage"); // Importe o modelo ChatMessage

const app = express();
const server = http.createServer(app);

// Configurações do CORS
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());

// Rotas de autenticação
app.use("/api/auth", authRoutes);

// Conexão com MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Erro MongoDB:", err));

// Configuração do Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Autenticação do Socket.IO
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Token não fornecido"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return next(new Error("Usuário não encontrado"));
    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Token inválido"));
  }
});

// Lógica do Socket.IO
io.on("connection", (socket) => {
  console.log(`🔌 Novo cliente conectado: ${socket.user.username}`);

  socket.on("edit_message", async (data) => {
    const { id, content } = data;
    try {
      const token = socket.handshake.auth.token;
      const response = await fetch(`http://localhost:5000/api/chat/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        console.error(
          "Erro ao editar mensagem no servidor via HTTP:",
          response.statusText
        );
        return;
      }

      // A resposta da rota PATCH (a mensagem atualizada) será emitida pelo backend.
      // Não precisamos emitir novamente aqui.
    } catch (error) {
      console.error("Erro ao processar edição de mensagem:", error);
    }
  });

  socket.on("send_cheer", () => {
    io.emit("cheer_update", {
      user: socket.user.username,
      count: Math.floor(Math.random() * 5) + 1,
    });
  });
});

// Rotas do chat (agora chamando a função e passando 'io')
const chatRouter = chatRoutes(io);
app.use("/api/chat", chatRouter);

// Rota para buscar mensagens iniciais
app.get("/api/chat", async (req, res) => {
  try {
    const messages = await ChatMessage.find()
      .sort({ createdAt: 1 })
      .populate("userId", "username");
    res.status(200).json(messages);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    res.status(500).json({ message: "Erro ao buscar mensagens", error });
  }
});

// Rota de saúde
app.get("/health", (req, res) => {
  res.json({
    status: "online",
    mongo: mongoose.connection.readyState === 1,
    sockets: io.engine.clientsCount,
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
