// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAl0s1Cqgb96Fo-PB-crvwUlgOizxywlIc",
    authDomain: "portfo-38945.firebaseapp.com",
    databaseURL: "https://portfo-38945-default-rtdb.firebaseio.com",
    projectId: "portfo-38945",
    storageBucket: "portfo-38945.appspot.com",
    messagingSenderId: "940278934017",
    appId: "1:940278934017:web:70a061b04e808eafedae00"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Database reference
  const db = firebase.database();
  const chatRef = db.ref('messages');
  
  // Get chat form elements
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  
  // Send new message
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const messageText = chatInput.value.trim();
  
    if (messageText) {
      const newMessage = {
        text: messageText,
        timestamp: Date.now()
      };
  
      chatRef.push(newMessage)
        .then(() => {
          chatInput.value = '';
          chatInput.focus();
        })
        .catch((error) => {
          alert('Error sending message: ' + error.message);
        });
    }
  });
  
  // Listen and display messages
  chatRef.limitToLast(50).on('child_added', (snapshot) => {
    const data = snapshot.val();
    displayMessage(data.text);
  });
  
  // Display message in chat
  function displayMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }