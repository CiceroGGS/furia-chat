const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Rota protegida
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Você está autenticado!", userId: req.userId });
});

module.exports = router;
