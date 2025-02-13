const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const logger = require("./utils/logger");
const fcmRouter = require("./routes/fcm.route");
const rssRouter = require("./routes/rss.route");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Setting up EJS
app.set("view engine", "ejs");

// Serves EJS templates from the "public" folder
app.set("views", path.join(__dirname, "public"));

// Serves static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/fcm", fcmRouter);
app.use("/api/rss", rssRouter);

// Renders the main page
app.get("/", (req, res) => {
  res.render("index", {
    firebaseConfig: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    },
    firebaseValidKey: process.env.FIREBASE_VALID_KEY,
    channelLink: process.env.CHANNEL_LINK || "#",
    headingText: process.env.HEADING_TEXT || "WELCOME...",
    channelImage: process.env.CHANNEL_IMAGE || "",
  });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(`Global error: ${err.message}`);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
