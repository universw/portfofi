const db = firebase.database();
const chatRef = db.ref("chatbox");

const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

// Send message
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
  } else {
    showNotification("You must be logged in to send a message.", "warning");
  }
});

// Listen for messages
chatRef.on("child_added", (snapshot) => {
  const data = snapshot.val();
  const key = snapshot.key;

  const msgDiv = document.createElement("div");
  msgDiv.className = "chat-message " + (data.sender.includes("admin") ? "admin-message" : "user-message");

  const msgText = document.createElement("span");
  msgText.textContent = `${data.sender}: ${data.text}`;

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
});