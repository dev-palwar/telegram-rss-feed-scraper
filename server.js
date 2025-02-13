const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const { POLL_INTERVAL, DEFAULT_CHANNEL } = require("./config/constants");
const RssService = require("./services/rss.service");
const logger = require("./utils/logger");

const port = process.env.PORT || 3000;

// Start server
const server = app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});

// Polling mechanism
const pollRssFeed = async () => {
  try {
    const { items } = await RssService.fetchFeed(DEFAULT_CHANNEL);
    logger.info(`Polled ${items.length} posts from ${DEFAULT_CHANNEL}`);
  } catch (error) {
    logger.error(`Polling failed: ${error.message}`);
  } finally {
    setTimeout(pollRssFeed, POLL_INTERVAL);
  }
};

// Start polling
pollRssFeed();

// Handle shutdown
process.on("SIGTERM", () => {
  logger.info("Shutting down server");
  server.close(() => process.exit(0));
});
