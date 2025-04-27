// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
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