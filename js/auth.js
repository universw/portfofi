function showNotification(message, type = "info", duration = 3000) {
    const box = document.getElementById("notification");
    const text = document.getElementById("notification-text");
    const icon = document.getElementById("notification-icon");
  
    if (!box || !text || !icon) return;
  
    // Set message and icon
    text.textContent = message;
  
    const icons = {
      success: "✅",
      error: "❌",
      info: "ℹ️",
      warning: "⚠️"
    };
    icon.textContent = icons[type] || "ℹ️";
  
    // Apply classes
    box.className = `notification show ${type}`;
  
    // Auto-close
    clearTimeout(box.timeoutId);
    box.timeoutId = setTimeout(() => {
      box.classList.remove("show");
    }, duration);
  }
  
  function hideNotification() {
    const box = document.getElementById("notification");
    if (box) box.classList.remove("show");
  }
  
  const auth = firebase.auth();
  
  // === AUTH FUNCTIONS ===
  
  function signUpWithEmail() {
    const email = document.getElementById("user-email").value;
    const password = document.getElementById("user-password").value;
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCred => showNotification("Signed up as: " + userCred.user.email, "success"))
      .catch(err => showNotification("Signup failed: " + err.message, "error"));
  }
  
  function loginWithEmail() {
    const email = document.getElementById("user-email").value;
    const password = document.getElementById("user-password").value;
    auth.signInWithEmailAndPassword(email, password)
      .then(userCred => showNotification("Logged in as: " + userCred.user.email, "success"))
      .catch(err => showNotification("Login failed: " + err.message, "error"));
  }
  
  function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(res => showNotification("Google login: " + res.user.displayName, "success"))
      .catch(err => showNotification("Google login failed: " + err.message, "error"));
  }
  
  function loginWithGithub() {
    const provider = new firebase.auth.GithubAuthProvider();
    auth.signInWithPopup(provider)
      .then(res => showNotification("GitHub login: " + res.user.displayName, "success"))
      .catch(err => showNotification("GitHub login failed: " + err.message, "error"));
  }
  
  function loginWithFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider)
      .then(res => showNotification("Facebook login: " + res.user.displayName, "success"))
      .catch(err => showNotification("Facebook login failed: " + err.message, "error"));
  }
  
  function userLogout() {
    auth.signOut()
      .then(() => showNotification("Logged out", "info"))
      .catch(err => showNotification("Logout failed: " + err.message, "error"));
  }
  
  // Expose to window
  window.signUpWithEmail = signUpWithEmail;
  window.loginWithEmail = loginWithEmail;
  window.loginWithGoogle = loginWithGoogle;
  window.loginWithGithub = loginWithGithub;
  window.loginWithFacebook = loginWithFacebook;
  window.userLogout = userLogout;
  
  // Auth state UI handling
  auth.onAuthStateChanged(user => {
    const chatbox = document.getElementById("chatbox");
    const contact = document.getElementById("contact");
    const reminder = document.getElementById("login-reminder");
  
    if (user) {
      if (chatbox) chatbox.style.display = "block";
      if (contact) contact.style.display = "block";
      if (reminder) reminder.style.display = "none";
      showNotification("Welcome, " + (user.displayName || user.email), "info");
    } else {
      if (chatbox) chatbox.style.display = "none";
      if (contact) contact.style.display = "none";
      if (reminder) reminder.style.display = "block";
    }
  });