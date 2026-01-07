

// ---- AUTH GUARD ----
checkAuth();

const token = localStorage.getItem("token");
const payload = (() => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
})();

if (!payload || !payload.isAdmin) {
  alert("Admin access only");
  logout();
}

// ---- LOAD USERS ----
function loadUsers() {
  fetch(`${API}/admin/users`, {
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    })
    .then(users => {
      userTable.innerHTML = "";

      if (!users.length) {
        userTable.innerHTML =
          `<tr><td colspan="5" class="text-center">No users found</td></tr>`;
        return;
      }

      users.forEach(u => {
        userTable.innerHTML += `
          <tr>
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>
              <span class="badge ${u.status === "ACTIVE" ? "bg-success" : "bg-danger"}">
                ${u.status}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-${
                u.status === "ACTIVE" ? "danger" : "success"
              }"
                onclick="toggleStatus(${u.id}, '${u.status}')">
                ${u.status === "ACTIVE" ? "Disable" : "Enable"}
              </button>
            </td>
          </tr>`;
      });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load users");
    });
}

// ---- TOGGLE USER STATUS ----
function toggleStatus(id, status) {
  const newStatus = status === "ACTIVE" ? "DISABLED" : "ACTIVE";

  if (!confirm(`Are you sure you want to ${newStatus === "ACTIVE" ? "enable" : "disable"} this user?`)) {
    return;
  }

  fetch(`${API}/admin/users/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ status: newStatus })
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to update user");
      return res.json();
    })
    .then(() => loadUsers())
    .catch(err => {
      console.error(err);
      alert("User status update failed");
    });
}

// ---- LOAD ALL TASKS (ADMIN) ----
function loadAllTasks() {
  fetch(`${API}/admin/tasks`, {
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    })
    .then(tasks => {
      adminTaskTable.innerHTML = "";

      if (!tasks.length) {
        adminTaskTable.innerHTML =
          `<tr><td colspan="6" class="text-center">No tasks found</td></tr>`;
        return;
      }

      tasks.forEach(t => {
        adminTaskTable.innerHTML += `
          <tr>
            <td>${t.user_name}</td>
            <td>${t.title}</td>
            <td>${t.status}</td>
            <td>${t.priority}</td>
            <td>
              <button class="btn btn-sm btn-danger"
                onclick="deleteTask(${t.id})">
                Delete
              </button>
            </td>
          </tr>`;
      });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load tasks");
    });
}

// ---- DELETE ANY TASK (ADMIN) ----
function deleteTask(id) {
  if (!confirm("Delete this task permanently?")) return;

  fetch(`${API}/admin/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => {
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    })
    .then(() => loadAllTasks())
    .catch(err => {
      console.error(err);
      alert("Task deletion failed");
    });
}

// ---- INIT ----
loadUsers();
loadAllTasks();
