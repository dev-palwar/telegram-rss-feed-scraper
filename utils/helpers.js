const getCurrentTime = () =>
  new Date().toLocaleTimeString("en-US", { hour12: false });

const validateChannel = (channel) => {
  if (!channel || typeof channel !== "string") {
    throw new Error("Invalid channel name");
  }
};

module.exports = {
  getCurrentTime,
  validateChannel,
};
