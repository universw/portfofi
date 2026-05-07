const contactRef = firebase.database().ref("contacts");
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = this.querySelectorAll("input");
    const name = inputs[0]?.value.trim();
    const email = inputs[1]?.value.trim();
    const message = this.querySelector("textarea")?.value.trim();

    if (name && email && message) {
      contactRef.push({ name, email, message, timestamp: Date.now() })
        .then(() => {
          alert("Message sent!");
          this.reset();
        })
        .catch((err) => {
          alert("Failed to send message.");
          console.error(err);
        });
    } else {
      alert("Please fill out all fields.");
    }
  });
}

// Load and display contact entries with delete
const contactList = document.getElementById("contact-messages");
if (contactList) {
  contactRef.on("child_added", (snapshot) => {
    const data = snapshot.val();
    const key = snapshot.key;
    const div = document.createElement("div");
    div.className = "contact-entry";
    const nameEl = document.createElement("strong");
    nameEl.textContent = data.name;
    div.appendChild(nameEl);
    div.appendChild(document.createTextNode(` (${data.email})`));
    div.appendChild(document.createElement("br"));
    div.appendChild(document.createTextNode(data.message));

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete-btn";
    delBtn.onclick = () => {
      if (confirm("Delete this message?")) {
        contactRef.child(key).remove();
        div.remove();
      }
    };

    div.appendChild(document.createElement("hr"));
    div.appendChild(delBtn);
    contactList.appendChild(div);
  });
}

// Clear all contacts
const clearContacts = document.getElementById("clear-contacts");
if (clearContacts && contactList) {
  clearContacts.addEventListener("click", () => {
    if (confirm("Clear all contact messages?")) {
      contactRef.remove();
      contactList.innerHTML = "";
    }
  });
}
