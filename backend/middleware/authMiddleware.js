const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.exp < Date.now() / 1000) {
        return res.status(401).json({ error: "Token expirado" });
      }
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: "Não autorizado, token falhou" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Não autorizado, sem token" });
  }
};

module.exports = { protect };
