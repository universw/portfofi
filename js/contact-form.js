// Reference to contacts node
const contactRef = db.ref('contacts');

// Get Contact Form
const contactForm = document.getElementById('contact-form');

// Submit Contact Form
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get input values
    const name = contactForm.querySelector('input[type="text"]').value.trim();
    const email = contactForm.querySelector('input[type="email"]').value.trim();
    const message = contactForm.querySelector('textarea').value.trim();

    if (name && email && message) {
        contactRef.push({
            name: name,
            email: email,
            message: message,
            timestamp: Date.now()
        }).then(() => {
            alert('Message Sent Successfully!');
            contactForm.reset();
        }).catch((error) => {
            alert('Error: ' + error.message);
        });
    }
});