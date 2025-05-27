const COMMENT_API = "https://portbackend-yp1j.onrender.com/api/comments"; // updated URL

async function loadComments() {
  try {
    const res = await fetch(COMMENT_API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const comments = await res.json();

    const list = document.getElementById("comment-list");
    list.innerHTML = "";

    if (comments.length === 0) {
      list.innerHTML = "<p>No comments yet.</p>";
      return;
    }

    comments.forEach(c => {
      const div = document.createElement("div");
      div.classList.add("comment-entry");
      div.innerHTML = `
        <strong>${sanitize(c.name)}</strong><br/>
        <p>${sanitize(c.message)}</p>
        <small>${new Date(c.timestamp).toLocaleString()}</small>
        ${c.adminReply ? `<div class="admin-reply"><strong>Admin:</strong> ${sanitize(c.adminReply)}</div>` : ""}
      `;
      list.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading comments:", err);
    document.getElementById("comment-list").innerHTML = "<p>Failed to load comments.</p>";
  }
}

// Simple text sanitizer to prevent script injection
function sanitize(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

document.getElementById("comment-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("comment-name").value.trim();
  const message = document.getElementById("comment-message").value.trim();
  const submitBtn = document.getElementById("submit-comment-btn");

  if (!name || !message) {
    alert("Please fill in both name and message.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = "Submitting...";

  try {
    const res = await fetch(COMMENT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    document.getElementById("comment-form").reset();
    loadComments();
    alert("Comment posted!");
  } catch (err) {
    alert("Failed to post comment.");
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit";
  }
});

window.addEventListener("DOMContentLoaded", loadComments);