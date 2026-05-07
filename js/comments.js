const COMMENT_API = "https://portbackend-yp1j.onrender.com/api/comments"; // updated URL

async function loadComments() {
  const list = document.getElementById("comment-list");
  if (!list) return;

  try {
    const res = await fetch(COMMENT_API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const comments = await res.json();

    list.innerHTML = "";

    if (comments.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "No comments yet.";
      list.appendChild(empty);
      return;
    }

    comments.forEach(c => {
      const div = document.createElement("div");
      div.classList.add("comment-entry");

      const name = document.createElement("strong");
      name.textContent = c.name || "Guest";
      const message = document.createElement("p");
      message.textContent = c.message || "";
      const timestamp = document.createElement("small");
      timestamp.textContent = c.timestamp ? new Date(c.timestamp).toLocaleString() : "";

      div.appendChild(name);
      div.appendChild(message);
      div.appendChild(timestamp);

      if (c.adminReply) {
        const reply = document.createElement("div");
        reply.className = "admin-reply";
        const replyLabel = document.createElement("strong");
        replyLabel.textContent = "Admin: ";
        reply.appendChild(replyLabel);
        reply.appendChild(document.createTextNode(c.adminReply));
        div.appendChild(reply);
      }

      list.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading comments:", err);
    list.textContent = "Failed to load comments.";
  }
}

document.getElementById("comment-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("comment-name").value.trim();
  const message = document.getElementById("comment-message").value.trim();
  const submitBtn = document.getElementById("submit-comment-btn");
  const defaultSubmitText = submitBtn.textContent;

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
    submitBtn.textContent = defaultSubmitText;
  }
});

window.addEventListener("DOMContentLoaded", loadComments);
