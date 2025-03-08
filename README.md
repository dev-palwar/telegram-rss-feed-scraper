# Telegram RSS Scraper & Notifier

This project consists of a Telegram Bot and a Node.js Web App that scrapes RSS feeds of a Telegram channel, stores the channel name in Firebase, and sends notifications for new posts.

## Features

✅ Update Telegram channel name via Telegram bot  
✅ Store channel name in Firebase  
✅ Fetch and scrape the latest post from RSS feed  
✅ Send push notifications to subscribed clients  

## Tech Stack

- **Backend**: Node.js, Express  
- **Database**: Firebase  
- **Frontend**: HTML, CSS, JavaScript  
- **Telegram Bot**: `node-telegram-bot-api`  
- **RSS Scraping**: `rss-parser` 
- **Notifications**: Web Push API  

## Setup & Running the Project

### 1. Clone the repository

```bash
git clone https://github.com/dev-palwar/telegram-rss-feed-scraper
cd telegram-rss-feed-scraper
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add the following:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_DB_URL=your_firebase_database_url
RSS_FEED_BASE_URL=your_rss_feed_base_url
```

### 4. Start the Telegram bot

Run the bot to update the channel name:

```bash
node telegram-bot.js
```

### 5. Start the Node.js server

```bash
npm start
```

Your web app should now be running at:

```
http://localhost:3000
```

### 6. Subscribe to Notifications

- Open the website  
- Allow notifications  
- Get updates when a new post is scraped 🎉  

## How It Works

### Telegram Bot
- Accepts a command to update `channelName`
- Stores the value in Firebase

### Web App (Node.js + Express)
- Serves static HTML, CSS, and JavaScript
- Fetches `channelName` from Firebase
- Sends it to the backend

### Backend (RSS Scraper)
- Scrapes the latest post from the Telegram channel's RSS feed
- Returns the latest post to the frontend

### Push Notifications
- Notifies subscribed users when a new post is available

## Contributing

Feel free to open issues or submit pull requests if you want to improve the project!
