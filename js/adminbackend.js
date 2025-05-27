const API = "https://portbackend-yp1j.onrender.com/api/comments";

// Load Comments
async function loadComments() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const comments = await res.json();
    const container = document.getElementById("comments");
    container.innerHTML = "";

    if (comments.length === 0) {
      container.innerHTML = "<p>No comments yet.</p>";
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

      div.innerHTML = `
        <strong>${comment.name}</strong><br>
        <p>${comment.message}</p>
        <small>${new Date(comment.timestamp).toLocaleString()}</small>

        ${comment.adminReply
          ? `<div class="admin-reply"><strong>Admin:</strong> ${comment.adminReply}</div>`
          : `
            <div class="reply-box">
              <textarea id="reply-${comment.id}" placeholder="Write admin reply..."></textarea>
              <button onclick="submitReply(${comment.id})">Send Reply</button>
            </div>
          `}
        <div class="delete-box">
          <button onclick="deleteComment(${comment.id})">Delete</button>
        </div>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading comments:", err);
    document.getElementById("comments").innerText = "Failed to load comments.";
  }
}

// Send Admin Reply
async function submitReply(id) {
  const reply = document.getElementById(`reply-${id}`).value.trim();
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