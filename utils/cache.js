const { CACHE_TTL } = require("../config/constants");
const logger = require("./logger");

class CacheManager {
  constructor() {
    this.store = new Map();
  }

  get(channel) {
    const entry = this.store.get(channel);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this.delete(channel);
      return null;
    }

    return entry.data;
  }

  set(channel, data) {
    this.store.set(channel, {
      timestamp: Date.now(),
      data,
    });
  }

  delete(channel) {
    this.store.delete(channel);
  }
}

module.exports = new CacheManager();
