const API = "https://portbackend-yp1j.onrender.com/api/comments";

// Load Comments
async function loadComments() {
  const container = document.getElementById("comments");
  if (!container) return;

  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const comments = await res.json();
    container.innerHTML = "";

    if (comments.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "No comments yet.";
      container.appendChild(empty);
      return;
    }

    const deleteAllBtn = document.createElement("button");
    deleteAllBtn.id = "delete-all-btn";
    deleteAllBtn.textContent = "Delete All Comments";
    deleteAllBtn.onclick = deleteAllComments;
    container.appendChild(deleteAllBtn);

    comments.forEach(comment => {
      const div = document.createElement("div");
      div.classList.add("comment");

      const name = document.createElement("strong");
      name.textContent = comment.name || "Guest";
      const message = document.createElement("p");
      message.textContent = comment.message || "";
      const timestamp = document.createElement("small");
      timestamp.textContent = comment.timestamp ? new Date(comment.timestamp).toLocaleString() : "";

      div.appendChild(name);
      div.appendChild(document.createElement("br"));
      div.appendChild(message);
      div.appendChild(timestamp);

      if (comment.adminReply) {
        const adminReply = document.createElement("div");
        adminReply.className = "admin-reply";
        const label = document.createElement("strong");
        label.textContent = "Admin: ";
        adminReply.appendChild(label);
        adminReply.appendChild(document.createTextNode(comment.adminReply));
        div.appendChild(adminReply);
      } else {
        const replyBox = document.createElement("div");
        replyBox.className = "reply-box";
        const textarea = document.createElement("textarea");
        textarea.id = `reply-${comment.id}`;
        textarea.placeholder = "Write admin reply...";
        const replyButton = document.createElement("button");
        replyButton.textContent = "Send Reply";
        replyButton.addEventListener("click", () => submitReply(comment.id));
        replyBox.appendChild(textarea);
        replyBox.appendChild(replyButton);
        div.appendChild(replyBox);
      }

      const deleteBox = document.createElement("div");
      deleteBox.className = "delete-box";
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteComment(comment.id));
      deleteBox.appendChild(deleteButton);
      div.appendChild(deleteBox);

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading comments:", err);
    container.innerText = "Failed to load comments.";
  }
}

// Send Admin Reply
async function submitReply(id) {
  const reply = document.getElementById(`reply-${id}`)?.value.trim();
  if (!reply) return;

  try {
    const res = await fetch(`${API}/${id}/reply`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ reply })
    });
    if (!res.ok) throw new Error(`Reply failed: HTTP ${res.status}`);
    loadComments();
  } catch (err) {
    alert("Failed to send reply.");
    console.error(err);
  }
}

// Delete Single Comment
async function deleteComment(id) {
  if (!confirm("Are you sure you want to delete this comment?")) return;
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error(`Delete failed: HTTP ${res.status}`);
    loadComments();
  } catch (err) {
    alert("Failed to delete comment.");
    console.error(err);
  }
}

// Delete All Comments
async function deleteAllComments() {
  if (!confirm("Delete ALL comments? This cannot be undone.")) return;
  try {
    const res = await fetch(API);
    const comments = await res.json();

    for (const comment of comments) {
      const delRes = await fetch(`${API}/${comment.id}`, {
        method: "DELETE"
      });
      if (!delRes.ok) throw new Error(`Failed to delete comment ID ${comment.id}`);
    }

    loadComments();
  } catch (err) {
    alert("Failed to delete all comments.");
    console.error(err);
  }
}

// Start loading when page is ready
window.onload = loadComments;
