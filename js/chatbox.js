// Your Firebase configuration
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

// Reference to the database
const db = firebase.database();
const chatRef = db.ref('messages');

// Get elements
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

// Submit new message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (message) {
        chatRef.push({
            text: message,
            timestamp: Date.now()
        });
        chatInput.value = '';
    }
});

// Listen for new messages
chatRef.on('child_added', (snapshot) => {
    const data = snapshot.val();
    displayMessage(data.text);
});

// Display message
function displayMessage(message) {
    const div = document.createElement('div');
    div.classList.add('chat-message');
    div.textContent = message;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}