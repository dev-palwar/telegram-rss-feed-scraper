const axios = require("axios");
const { parseString } = require("xml2js");
const { promisify } = require("util");
const logger = require("../utils/logger");
const { RSS_BASE_URL } = require("../config/constants");

const parseXml = promisify(parseString);

class RssService {
  constructor() {
    this.timeout = 10000; // 10 seconds timeout
  }

  async fetchFeed(channel) {
    try {
      const response = await axios.get(`${RSS_BASE_URL}/${channel}`, {
        timeout: this.timeout,
      });

      const result = await parseXml(response.data, {
        explicitArray: false,
        ignoreAttrs: true,
      });

      return {
        channel: result.rss.channel,
        items: Array.isArray(result.rss.channel.item)
          ? result.rss.channel.item
          : [result.rss.channel.item],
      };
    } catch (error) {
      logger.error(`RSS fetch failed for ${channel}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new RssService();
