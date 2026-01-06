const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

/* =========================
   LOAD USERS
========================= */
function loadUsers() {
  fetch(`${API_URL}/admin/users`, {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => {
    if (res.status === 401 || res.status === 403) {
      alert("Admin access only");
      window.location = "dashboard.html";
    }
    return res.json();
  })
  .then(users => {
    const table = document.getElementById("userTable");
    table.innerHTML = "";

    users.forEach(u => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${u.id}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>${u.status}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1"
            onclick="toggleUserStatus(${u.id}, '${u.status}')">
            ${u.status === "ACTIVE" ? "Disable" : "Enable"}
          </button>
          <button class="btn btn-sm btn-info"
            onclick="makeAdmin(${u.id})">
            Make Admin
          </button>
        </td>
      `;
      table.appendChild(row);
    });
  });
}

/* =========================
   TOGGLE USER STATUS
========================= */
function toggleUserStatus(userId, status) {
  const newStatus = status === "ACTIVE" ? "DISABLED" : "ACTIVE";

  fetch(`${API_URL}/admin/users/${userId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ status: newStatus })
  })
  .then(loadUsers);
}

/* =========================
   MAKE USER ADMIN
========================= */
function makeAdmin(userId) {
  fetch(`${API_URL}/admin/users/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ role: "ADMIN" })
  })
  .then(loadUsers);
}

/* =========================
   LOAD TASKS
========================= */
function loadTasks() {
  fetch(`${API_URL}/admin/tasks`, {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(tasks => {
    const table = document.getElementById("taskTable");
    table.innerHTML = "";

    tasks.forEach(t => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${t.title}</td>
        <td>${t.user_email}</td>
        <td>
          <select class="form-select form-select-sm"
            onchange="updateTaskStatus(${t.id}, this.value)">
            <option ${t.status === "TODO" ? "selected" : ""}>TODO</option>
            <option ${t.status === "IN_PROGRESS" ? "selected" : ""}>IN_PROGRESS</option>
            <option ${t.status === "COMPLETED" ? "selected" : ""}>COMPLETED</option>
          </select>
        </td>
        <td>${t.priority}</td>
        <td>${t.due_date || "-"}</td>
        <td>
          <button class="btn btn-sm btn-danger"
            onclick="deleteTask(${t.id})">
            Delete
          </button>
        </td>
      `;
      table.appendChild(row);
    });
  });
}

/* =========================
   UPDATE TASK STATUS
========================= */
function updateTaskStatus(taskId, status) {
  fetch(`${API_URL}/admin/tasks/${taskId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ status })
  });
}

/* =========================
   DELETE TASK
========================= */
function deleteTask(taskId) {
  if (!confirm("Delete this task?")) return;

  fetch(`${API_URL}/admin/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  })
  .then(loadTasks);
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("token");
  window.location = "index.html";
}

/* =========================
   INIT
========================= */
loadUsers();
loadTasks();
