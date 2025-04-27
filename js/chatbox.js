// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YAIzaSyAl0s1Cqgb96Fo-PB-crvwUlgOizxywlIc",
    authDomain: "portfo-38945.firebaseapp.com",
    databaseURL: "https://portfo-38945-default-rtdb.firebaseio.com",
    projectId: "portfo-38945",
    storageBucket: "portfo-38945.firebasestorage.app",
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

// Listen for submit
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
    div.textContent = message;
    div.style.marginBottom = '0.5rem';
    div.style.padding = '0.5rem';
    div.style.backgroundColor = '#f0f0f0';
    div.style.borderRadius = '5px';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}