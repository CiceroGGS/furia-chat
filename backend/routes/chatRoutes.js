const express = require("express");
const { getMessages, postMessage } = require("../controllers/chatController");

const router = express.Router();

router.get("/", getMessages);
router.post("/", postMessage);

module.exports = router;
