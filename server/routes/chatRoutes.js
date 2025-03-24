const express = require("express");
const router = express.Router();
const { sendMessage, getMessages } = require("../controllers/chatController");

router.post("/send", sendMessage);
router.get("/:user1/:user2", getMessages); // Ensure correct param names

module.exports = router;
