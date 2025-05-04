// Firebase config
const firebaseConfig = {
  apiKey: "YAIzaSyAl0s1Cqgb96Fo-PB-crvwUlgOizxywlIc",
  authDomain: "portfo-38945.firebaseapp.com",
  databaseURL: "https://portfo-38945-default-rtdb.firebaseio.com",
  projectId: "portfo-38945",
  storageBucket: "portfo-38945.appspot.com",
  messagingSenderId: "940278934017",
  appId: "1:940278934017:web:70a061b04e808eafedae00"
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