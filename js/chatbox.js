// Firebase Realtime DB Reference
const db = firebase.database();
const chatRef = db.ref("chatbox");

// DOM Elements
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const typingIndicator = document.createElement("div");
typingIndicator.className = "typing-indicator";
chatMessages.parentNode.insertBefore(typingIndicator, chatMessages.nextSibling);
const messageSound = new Audio("pop.mp3");

// Escape HTML to prevent XSS
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[m]));
}

// Show Notification
function showNotification(message, type = "info") {
  const notif = document.getElementById("notification");
  const notifText = document.getElementById("notification-text");
  const notifIcon = document.getElementById("notification-icon");

  notifText.textContent = message;
  notifIcon.textContent = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";

  notif.style.display = "flex";
  setTimeout(() => notif.style.display = "none", 4000);
}

// Typing Indicator Logic
let typingTimeout;
chatInput?.addEventListener("input", () => {
  const user = firebase.auth().currentUser;
  if (user) {
    db.ref("typing").child(user.email.replace(/[.#$\[\]]/g, '_')).set(true);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      db.ref("typing").child(user.email.replace(/[.#$\[\]]/g, '_')).remove();
    }, 2000);
  }
});

db.ref("typing").on("value", (snapshot) => {
  const typingUsers = snapshot.val() || {};
  const user = firebase.auth().currentUser;
  const currentEmail = user ? user.email.replace(/[.#$\[\]]/g, '_') : "";
  const othersTyping = Object.keys(typingUsers).filter(email => email !== currentEmail);
  if (othersTyping.length > 0) {
    typingIndicator.textContent = "Someone is typing...";
    typingIndicator.style.display = "block";
  } else {
    typingIndicator.style.display = "none";
  }
});

// Send Message
chatForm?.addEventListener("submit", (e) => {
  e.preventDefault();
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
    db.ref("typing").child(user.email.replace(/[.#$\[\]]/g, '_')).remove();
  } else {
    showNotification("You must be logged in to send a message.", "warning");
  }
});

// Render Message
chatRef.on("child_added", (snapshot) => {
  const data = snapshot.val();
  const key = snapshot.key;

  const msgDiv = document.createElement("div");
  const isAdmin = data.sender.toLowerCase().includes("admin");
  msgDiv.className = "chat-message " + (isAdmin ? "admin-message" : "user-message");

  const msgText = document.createElement("span");
  const senderName = isAdmin ? "Admin" : escapeHTML(data.sender);
  msgText.innerHTML = `<strong>${senderName}:</strong> ${escapeHTML(data.text)}`;

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
  messageSound.play();
});
