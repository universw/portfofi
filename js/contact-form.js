// Reference to contacts node
const contactRef = db.ref('contacts');

// Get Contact Form
const contactForm = document.getElementById('contact-form');

// Submit Contact Form
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = contactForm.querySelector('input[type="text"]').value.trim();
  const email = contactForm.querySelector('input[type="email"]').value.trim();
  const message = contactForm.querySelector('textarea').value.trim();

  if (name && email && message) {
    const newContact = {
      name: name,
      email: email,
      message: message,
      timestamp: Date.now()
    };

    contactRef.push(newContact)
      .then(() => {
        alert('Message sent successfully!');
        contactForm.reset();
      })
      .catch((error) => {
        alert('Error sending message: ' + error.message);
      });
  } else {
    alert('Please fill out all fields.');
  }
});