// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDjo6SjdfLCNtNN4lT8aKORY7CIP-WJH9U",
  authDomain: "portfofia.firebaseapp.com",
  databaseURL: "https://portfofia-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portfofia",
  storageBucket: "portfofia.appspot.com",
  messagingSenderId: "633781124250",
  appId: "1:633781124250:web:c6680357071539a254f323"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
const chatRef = db.ref("chatbox");

// DOM Elements
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

// Send message
chatForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (message && auth.currentUser) {
    chatRef.push({
      text: message,
      sender: auth.currentUser.email || "user",
      timestamp: Date.now()
    });
    chatInput.value = "";
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
      chatRef.child(key).remove();
      msgDiv.remove();
    }
  };

  msgDiv.appendChild(msgText);
  msgDiv.appendChild(delBtn);
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// ================= AUTH =================

// Email Sign Up
function signUpWithEmail() {
  const email = document.getElementById("user-email").value;
  const password = document.getElementById("user-password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCred) => alert("Signed up as: " + userCred.user.email))
    .catch(err => alert(err.message));
}

// Email Login
function loginWithEmail() {
  const email = document.getElementById("user-email").value;
  const password = document.getElementById("user-password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then((userCred) => alert("Logged in as: " + userCred.user.email))
    .catch(err => alert(err.message));
}

// Google Login
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(res => alert("Google login: " + res.user.displayName))
    .catch(err => alert(err.message));
}

// GitHub Login
function loginWithGithub() {
  const provider = new firebase.auth.GithubAuthProvider();
  auth.signInWithPopup(provider)
    .then(res => alert("GitHub login: " + res.user.displayName))
    .catch(err => alert(err.message));
}

// Facebook Login
function loginWithFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  auth.signInWithPopup(provider)
    .then(res => alert("Facebook login: " + res.user.displayName))
    .catch(err => alert(err.message));
}

// Logout
function userLogout() {
  auth.signOut().then(() => alert("Logged out")).catch(err => alert(err.message));
}

// Expose to HTML
window.signUpWithEmail = signUpWithEmail;
window.loginWithEmail = loginWithEmail;
window.loginWithGoogle = loginWithGoogle;
window.loginWithGithub = loginWithGithub;
window.loginWithFacebook = loginWithFacebook;
window.userLogout = userLogout;

// Auth state change
auth.onAuthStateChanged((user) => {
  const chatbox = document.getElementById("chatbox");
  const contact = document.getElementById("contact");
  const reminder = document.getElementById("login-reminder");

  if (user) {
    if (chatbox) chatbox.style.display = "block";
    if (contact) contact.style.display = "block";
    if (reminder) reminder.style.display = "none";
  } else {
    if (chatbox) chatbox.style.display = "none";
    if (contact) contact.style.display = "none";
    if (reminder) reminder.style.display = "block";
  }
});