// ================================
// AUTH & BASIC SETUP
// ================================
checkAuth(); // from auth.js

const token = localStorage.getItem("token");
const payload = JSON.parse(atob(token.split(".")[1]));

let editTaskId = null;

// ================================
// ADMIN BUTTON VISIBILITY
// ================================
document.addEventListener("DOMContentLoaded", () => {
  if (payload.isAdmin) {
    const adminBtn = document.getElementById("adminBtn");
    if (adminBtn) {
      adminBtn.classList.remove("d-none");
    }
  }
});

// ================================
// NAVIGATION
// ================================
function goToAdmin() {
  window.location.href = "admin.html";
}

// ================================
// LOAD TASKS (USER / ADMIN-AS-USER)
// ================================
function loadTasks() {
  fetch(`${API}/tasks`, {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to load tasks");
      return res.json();
    })
    .then(tasks => {
      const taskTable = document.getElementById("taskTable");
      taskTable.innerHTML = "";

      if (!tasks.length) {
        taskTable.innerHTML =
          `<tr><td colspan="5" class="text-center">No tasks found</td></tr>`;
        return;
      }

      tasks.forEach(t => {
        taskTable.innerHTML += `
          <tr>
            <td>${escapeHtml(t.title)}</td>
            <td>${escapeHtml(t.description || "-")}</td>
            <td>
              <span class="badge bg-${statusColor(t.status)}">
                ${t.status}
              </span>
            </td>
            <td>${t.priority}</td>
            <td>
              <button class="btn btn-sm btn-warning me-1"
                onclick="openEditModal(
                  ${t.id},
                  '${escapeHtml(t.title)}',
                  '${escapeHtml(t.description || "")}',
                  '${t.status}',
                  '${t.priority}'
                )">
                Edit
              </button>

              <button class="btn btn-sm btn-danger"
                onclick="deleteTask(${t.id})">
                Delete
              </button>
            </td>
          </tr>
        `;
      });
    })
    .catch(err => {
      console.error(err);
      alert("Unable to load tasks");
    });
}

// ================================
// ADD TASK
// ================================
function addTask() {
  const titleEl = document.getElementById("title");
  const descEl = document.getElementById("description");
  const priorityEl = document.getElementById("priority");

  if (!titleEl.value.trim()) {
    alert("Task title is required");
    return;
  }

  fetch(`${API}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      title: titleEl.value.trim(),
      description: descEl.value.trim(),
      priority: priorityEl.value
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Task creation failed");
      return res.json();
    })
    .then(() => {
      titleEl.value = "";
      descEl.value = "";
      priorityEl.value = "MEDIUM";
      loadTasks();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to create task");
    });
}

// ================================
// EDIT TASK (OPEN MODAL)
// ================================
function openEditModal(id, title, description, status, priority) {
  editTaskId = id;

  document.getElementById("editTitle").value = title;
  document.getElementById("editDesc").value = description;
  document.getElementById("editStatus").value = status;
  document.getElementById("editPriority").value = priority;

  new bootstrap.Modal(document.getElementById("editModal")).show();
}

// ================================
// UPDATE TASK
// ================================
function updateTask() {
  fetch(`${API}/tasks/${editTaskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      title: document.getElementById("editTitle").value.trim(),
      description: document.getElementById("editDesc").value.trim(),
      status: document.getElementById("editStatus").value,
      priority: document.getElementById("editPriority").value
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    })
    .then(() => {
      bootstrap.Modal
        .getInstance(document.getElementById("editModal"))
        .hide();

      loadTasks();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to update task");
    });
}

// ================================
// DELETE TASK
// ================================
function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    })
    .then(() => loadTasks())
    .catch(err => {
      console.error(err);
      alert("Failed to delete task");
    });
}

// ================================
// HELPERS
// ================================
function statusColor(status) {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "IN_PROGRESS":
      return "warning";
    default:
      return "secondary";
  }
}

function escapeHtml(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

// ================================
// INIT
// ================================
loadTasks();
