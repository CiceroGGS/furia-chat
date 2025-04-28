const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Obter o token do cabeçalho
      token = req.headers.authorization.split(" ")[1];

      // Verificar o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar o usuário pelo ID decodificado no token (excluindo a senha)
      req.user = await User.findById(decoded.userId).select("-password");

      next(); // Permitir que a requisição prossiga para a próxima middleware ou rota
    } catch (error) {
      console.error("Erro na autenticação:", error);
      res.status(401).json({ message: "Não autorizado, token inválido." });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ message: "Não autorizado, nenhum token fornecido." });
  }
};

module.exports = { protect };
