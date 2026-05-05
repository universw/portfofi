const contactRef = firebase.database().ref("contacts");

document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = this.querySelector('input[placeholder="Name"]').value.trim();
  const email = this.querySelector('input[placeholder="Email"]').value.trim();
  const message = this.querySelector("textarea").value.trim();

  if (name && email && message) {
    contactRef.push({ name, email, message, timestamp: Date.now() });
    alert("Message sent!");
    this.reset();
  } else {
    alert("Please fill out all fields.");
  }
});

// Load and display contact entries with delete
const contactList = document.getElementById("contact-messages");
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

// Clear all contacts
document.getElementById("clear-contacts").addEventListener("click", () => {
  if (confirm("Clear all contact messages?")) {
    contactRef.remove();
    contactList.innerHTML = "";
  }
});