// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDjo6SjdfLCNtNN4lT8aKORY7CIP-WJH9U",
  authDomain: "portfofia.firebaseapp.com",
  databaseURL: "https://portfofia-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portfofia",
  storageBucket: "portfofia.firebasestorage.app",
  messagingSenderId: "633781124250",
  appId: "1:633781124250:web:c6680357071539a254f323"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const chatRef = db.ref("chatbox");

// DOM
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

// Send message from user
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = chatInput.value.trim();

  if (messageText) {
    chatRef.push({
      text: messageText,
      sender: "user",
      timestamp: Date.now()
    });

    chatInput.value = "";
    chatInput.focus();
  }
});

// Listen and show messages
chatRef.limitToLast(50).on("child_added", (snapshot) => {
  const data = snapshot.val();
  displayMessage(data.text, data.sender);
});

function displayMessage(text, sender) {
  const div = document.createElement("div");
  div.textContent = text;
  div.classList.add("chat-message");
  div.classList.add(sender === "admin" ? "admin-message" : "user-message");
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}