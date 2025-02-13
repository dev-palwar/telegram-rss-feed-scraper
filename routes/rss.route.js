const express = require("express");
const router = express.Router();
const RssService = require("../services/rss.service");
const NotificationService = require("../services/notification.service");
const cache = require("../utils/cache");
const { validateChannel } = require("../utils/helpers");
const logger = require("../utils/logger");

router.get("/", async (req, res) => {
  try {
    const { channel } = req.query;
    validateChannel(channel);

    const cachedData = cache.get(channel);
    if (cachedData) {
      logger.debug(`Serving cached data for ${channel}`);
      return res.json(cachedData);
    }

    const { items, channel: channelData } = await RssService.fetchFeed(channel);
    const responseData = { channel: channelData, items };

    cache.set(channel, responseData);
    checkForNewPosts(channel, items);

    res.json(responseData);
  } catch (error) {
    logger.error(`RSS request failed: ${error.message}`);
    res.status(error.status || 500).json({ error: error.message });
  }
});

async function checkForNewPosts(channel, currentItems) {
  try {
    const cachedItems = cache.get(channel)?.items || [];
    const currentGuids = new Set(currentItems.map((item) => item.guid));
    const newPosts = currentItems.filter(
      (item) => !cachedItems.some((cached) => cached.guid === item.guid)
    );

    if (newPosts.length > 0) {
      logger.info(`Found ${newPosts.length} new posts in ${channel}`);
      await NotificationService.sendNotifications(newPosts);
    }
  } catch (error) {
    logger.error(`New post check failed: ${error.message}`);
  }
}

module.exports = router;
