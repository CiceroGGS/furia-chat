const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Função para registrar um novo usuário
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validação básica
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Nome de usuário e senha são obrigatórios." });
    }

    // Verificar se o nome de usuário já existe
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(409).json({ message: "Nome de usuário já existe." });
    }

    // Verificar se o e-mail já existe (se fornecido)
    if (email) {
      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail) {
        return res.status(409).json({ message: "E-mail já existe." });
      }
    }

    // Criar um novo usuário
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Erro ao registrar o usuário." });
  }
};

// Função para logar um usuário existente
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validação básica
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Nome de usuário e senha são obrigatórios." });
    }

    // Buscar o usuário pelo nome de usuário
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    // Comparar a senha fornecida com a senha armazenada
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    // Gerar um JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Enviar o token e o username na resposta
    res
      .status(200)
      .json({ message: "Login bem-sucedido!", token, username: user.username });
  } catch (error) {
    console.error("Erro ao logar usuário:", error);
    res.status(500).json({ message: "Erro ao logar o usuário." });
  }
};
