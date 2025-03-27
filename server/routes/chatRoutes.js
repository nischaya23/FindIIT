const express = require("express");
const router = express.Router();
const { sendMessage, getMessages } = require("../controllers/chatController");
const { getPreviousChats } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/send", sendMessage);
router.get("/:user1/:user2", getMessages); // Ensure correct param names

//IDHAR change
router.get("/previous-chats", authMiddleware, getPreviousChats);
module.exports = router;