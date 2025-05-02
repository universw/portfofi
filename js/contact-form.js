// Save contact form messages to Firebase
document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = this.querySelector('input[placeholder="Name"]').value.trim();
  const email = this.querySelector('input[placeholder="Email"]').value.trim();
  const message = this.querySelector("textarea").value.trim();

  if (name && email && message) {
    const contactRef = firebase.database().ref("contacts");
    contactRef.push({
      name,
      email,
      message,
      timestamp: Date.now()
    });

    alert("Message sent! Thank you.");
    this.reset();
  } else {
    alert("Please fill out all fields.");
  }
});