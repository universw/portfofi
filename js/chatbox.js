// ================== Firebase Config ==================
const firebaseConfig = {
  apiKey: "YAIzaSyAl0s1Cqgb96Fo-PB-crvwUlgOizxywlIc",
  authDomain: "portfo-38945.firebaseapp.com",
  databaseURL: "https://portfo-38945-default-rtdb.firebaseio.com",
  projectId: "portfo-38945",
  storageBucket: "portfo-38945.appspot.com",
  messagingSenderId: "940278934017",
  appId: "1:940278934017:web:70a061b04e808eafedae00"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
const chatRef = db.ref("chatbox");

// ================== Chat Messaging ==================
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

chatForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (message) {
    chatRef.push({
      text: message,
      sender: "user",
      timestamp: Date.now()
    });
    chatInput.value = "";
    chatInput.focus();
  }
});

chatRef.on("child_added", (snapshot) => {
  const data = snapshot.val();
  const key = snapshot.key;

  const div = document.createElement("div");
  div.className = data.sender === "admin" ? "chat-message admin-message" : "chat-message user-message";

  const span = document.createElement("span");
  span.textContent = data.text;

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "delete-btn";
  delBtn.onclick = () => {
    if (confirm("Delete this message?")) {
      chatRef.child(key).remove();
      div.remove();
    }
  };

  div.appendChild(span);
  div.appendChild(delBtn);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// ================== Authentication ==================
function loginWithEmail() {
  const email = document.getElementById("user-email").value;
  const password = document.getElementById("user-password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(user => alert("Logged in: " + user.user.email))
    .catch(err => alert(err.message));
}

function signUpWithEmail() {
  const email = document.getElementById("user-email").value;
  const password = document.getElementById("user-password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(user => alert("Signed up: " + user.user.email))
    .catch(err => alert(err.message));
}

function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => alert("Google login: " + result.user.displayName))
    .catch(err => alert(err.message));
}

function loginWithGithub() {
  const provider = new firebase.auth.GithubAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => alert("GitHub login: " + result.user.displayName))
    .catch(err => alert(err.message));
}

function loginWithFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => alert("Facebook login: " + result.user.displayName))
    .catch(err => alert(err.message));
}

function userLogout() {
  auth.signOut()
    .then(() => alert("Logged out"))
    .catch(err => alert(err.message));
}

// Make functions global
window.loginWithEmail = loginWithEmail;
window.signUpWithEmail = signUpWithEmail;
window.loginWithGoogle = loginWithGoogle;
window.loginWithGithub = loginWithGithub;
window.loginWithFacebook = loginWithFacebook;
window.userLogout = userLogout;

// ================== UI Toggle by Login State ==================
auth.onAuthStateChanged((user) => {
  const contactForm = document.getElementById("contact-form");
  const chatboxSection = document.getElementById("chatbox");
  const reminder = document.getElementById("login-reminder");

  if (user) {
    if (contactForm) contactForm.style.display = "block";
    if (chatboxSection) chatboxSection.style.display = "block";
    if (reminder) reminder.style.display = "none";
  } else {
    if (contactForm) contactForm.style.display = "none";
    if (chatboxSection) chatboxSection.style.display = "none";
    if (reminder) reminder.style.display = "block";
  }
});