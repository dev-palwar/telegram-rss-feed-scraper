const admin = require("../config/firebase");
const logger = require("../utils/logger");

class NotificationService {
  async send(token, title, body) {
    try {
      const message = {
        notification: { title, body },
        token,
      };

      const response = await admin.messaging().send(message);
      logger.info(`Notification sent: ${response}`);
      return true;
    } catch (error) {
      logger.error(`Notification failed: ${error.message}`);
      return false;
    }
  }
}

module.exports = new NotificationService();
