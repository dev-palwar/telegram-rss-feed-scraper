const { getCurrentTime } = require("./helpers");

const logger = {
  info: (message) => console.log(`[${getCurrentTime()}] INFO: ${message}`),
  error: (message) => console.error(`[${getCurrentTime()}] ERROR: ${message}`),
  debug: (message) => console.debug(`[${getCurrentTime()}] DEBUG: ${message}`),
};

module.exports = logger;
