const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const messaging = firebase.messaging();

let channelName = "";
// const firebaseValidKey =
//   "BFDu6aXRrMkzryqU32Yb3pOuS_LXnODPnavFE-nQZbui05EpNHPDiudE4K6HFx7jV4Wexy7ohJfpWNMlr2M5wCo";

// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered");
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

// Utility Functions
const getCurrentTime = () =>
  new Date().toLocaleTimeString("en-US", { hour12: false });

const log = (message) => {
  console.log(`[${getCurrentTime()}] ${message}`);
};

const logError = (message) => {
  console.error(`[${getCurrentTime()}] ERROR: ${message}`);
};

// Firestore Listener
const setupFirestoreListener = () => {
  db.collection("params")
    .doc("minimal")
    .onSnapshot((doc) => {
      const data = doc.data();
      if (data) {
        channelName = data.param1;
        log(`Updated channelName from Firestore: ${channelName}`);
      }
    });
};

// Render Posts
const renderPosts = (items) => {
  const telegramContainer = document.querySelector(".telegram-container");
  telegramContainer.innerHTML = "";

  const createPostElement = (item) => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("telegram-post");
    postDiv.innerHTML = `<h2>${item.title}</h2><p>${item.description}</p>`;
    return postDiv;
  };

  if (Array.isArray(items)) {
    items.forEach((item) => {
      telegramContainer.appendChild(createPostElement(item));
    });
  } else {
    telegramContainer.appendChild(createPostElement(items));
  }
};

// Fetchs Posts
const fetchPosts = async () => {
  log(`Checking for new posts in channel: ${channelName}`);

  try {
    const response = await fetch(`/api/rss?channel=thisonejsbot`);
    const data = await response.json();

    // log(`Fetched new posts: ${JSON.stringify(data)}`);

    // Updates UI
    document.getElementById("heading").innerText = data.channel.title;
    document.getElementById("channelImageOnClient").src =
      data.channel.image.url;

    const profileLink = document.querySelector("a[href]");
    if (profileLink && data.channel.link) {
      profileLink.href = data.channel.link;
    }

    renderPosts(data.channel.item);
  } catch (error) {
    logError(`Error fetching RSS feed: ${error.message}`);
    document.querySelector(".telegram-container").innerHTML =
      "<p>Failed to load posts. Please try again later.</p>";
  }
};

// Notification Permission
const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      log("Notification permission granted.");
      const token = await messaging.getToken({
        vapidKey: firebaseValidKey,
      });
      log(`FCM Token: ${token}`);

      await sendFCNToBackend(token);
    } else {
      log("Notification permission denied.");
    }
  } catch (error) {
    logError(`Error requesting notification permission: ${error.message}`);
  }
};

// Sends FCM Token to Backend
const sendFCNToBackend = async (token) => {
  try {
    const response = await fetch("/api/sendFCN", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error("Failed to send FCM token to backend");
    }

    const data = await response.json();
    log(`FCM token sent to backend: ${JSON.stringify(data)}`);
  } catch (error) {
    logError(`Error sending FCM token: ${error.message}`);
  }
};

// Initializes App
const initializeApp = () => {
  setupFirestoreListener();
  setTimeout(fetchPosts, 2000); // Initial fetch after 2 seconds
  document.addEventListener("DOMContentLoaded", requestNotificationPermission);
};

// Starts the App
initializeApp();
