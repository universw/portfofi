// Firebase Realtime DB Reference
const db = firebase.database();
const chatRef = db.ref("chatbox");

// DOM Elements
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const typingIndicator = document.createElement("div");
typingIndicator.className = "typing-indicator";
if (chatMessages?.parentNode) {
  chatMessages.parentNode.insertBefore(typingIndicator, chatMessages.nextSibling);
}
const messageSound = new Audio("assets/sounds/click.mp3");
let chatListenerActive = false;
let typingListenerActive = false;

// Escape HTML to prevent XSS
function escapeHTML(str) {
  return String(str || "").replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[m]));
}

// Show Notification
function showNotification(message, type = "info") {
  const notif = document.getElementById("notification");
  const notifText = document.getElementById("notification-text");
  const notifIcon = document.getElementById("notification-icon");
  if (!notif || !notifText || !notifIcon) return;

  notifText.textContent = message;
  notifIcon.textContent = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";

  notif.classList.add("show");
  setTimeout(() => notif.classList.remove("show"), 4000);
}

function userKey(user) {
  return user?.email ? user.email.replace(/[.#$\[\]]/g, '_') : "";
}

// Typing Indicator Logic
let typingTimeout;
chatInput?.addEventListener("input", () => {
  const user = firebase.auth().currentUser;
  if (user) {
    db.ref("typing").child(userKey(user)).set(true);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      db.ref("typing").child(userKey(user)).remove();
    }, 2000);
  }
});

function handleTyping(snapshot) {
  const typingUsers = snapshot.val() || {};
  const currentEmail = userKey(firebase.auth().currentUser);
  const othersTyping = Object.keys(typingUsers).filter(email => email !== currentEmail);
  if (othersTyping.length > 0) {
    typingIndicator.textContent = "Someone is typing...";
    typingIndicator.style.display = "block";
  } else {
    typingIndicator.style.display = "none";
  }
}

// Send Message
chatForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!chatInput) return;
  const message = chatInput.value.trim();
  const user = firebase.auth().currentUser;

  if (message && user) {
    chatRef.push({
      text: message,
      sender: user.email || "user",
      timestamp: Date.now()
    }).then(() => {
      showNotification("Message sent", "success");
    }).catch(err => {
      showNotification("Failed to send message: " + err.message, "error");
    });
    chatInput.value = "";
    db.ref("typing").child(userKey(user)).remove();
  } else {
    showNotification("You must be logged in to send a message.", "warning");
  }
});

// Render Message
function handleChatMessage(snapshot) {
  if (!chatMessages) return;
  const data = snapshot.val();
  const key = snapshot.key;
  if (!data || !data.text || !data.sender) return;

  const msgDiv = document.createElement("div");
  const sender = String(data.sender);
  const isAdmin = sender.toLowerCase().includes("admin");
  msgDiv.className = "chat-message " + (isAdmin ? "admin-message" : "user-message");

  const msgText = document.createElement("span");
  const senderLabel = document.createElement("strong");
  senderLabel.textContent = `${isAdmin ? "Admin" : sender}: `;
  msgText.appendChild(senderLabel);
  msgText.appendChild(document.createTextNode(data.text));

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "delete-btn";
  delBtn.onclick = () => {
    if (confirm("Delete this message?")) {
      chatRef.child(key).remove().then(() => {
        msgDiv.remove();
        showNotification("Message deleted", "info");
      }).catch(err => {
        showNotification("Delete failed: " + err.message, "error");
      });
    }
  };

  msgDiv.appendChild(msgText);
  msgDiv.appendChild(delBtn);
  chatMessages.appendChild(msgDiv);

  chatMessages.scrollTop = chatMessages.scrollHeight;
  messageSound.play().catch(() => {});
}

function startChatListeners() {
  if (!chatMessages) return;

  if (!typingListenerActive) {
    db.ref("typing").on("value", handleTyping);
    typingListenerActive = true;
  }

  if (!chatListenerActive) {
    chatRef.on("child_added", handleChatMessage);
    chatListenerActive = true;
  }
}

function stopChatListeners() {
  if (typingListenerActive) {
    db.ref("typing").off("value", handleTyping);
    typingListenerActive = false;
  }

  if (chatListenerActive) {
    chatRef.off("child_added", handleChatMessage);
    chatListenerActive = false;
  }

  typingIndicator.style.display = "none";
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    startChatListeners();
  } else {
    stopChatListeners();
  }
});
