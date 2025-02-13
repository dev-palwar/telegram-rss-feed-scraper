const express = require("express");
const router = express.Router();
const cache = require("../utils/cache");
const logger = require("../utils/logger");

router.post("/sendFCN", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      logger.error("Missing FCM token in request");
      return res.status(400).json({ error: "Token is required" });
    }

    // Add to persistent storage in real application
    cache.set(`fcm:${token}`, true);

    logger.info(`FCM token registered: ${token}`);
    res.json({ message: "Token registered successfully" });
  } catch (error) {
    logger.error(`FCM registration error: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
