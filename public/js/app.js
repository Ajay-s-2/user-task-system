const API_URL = "http://localhost:5000/api";

/* =========================
   LOGIN
========================= */
function login() {
  const email = document.getElementById('loginEmail');
  const password = document.getElementById('loginPassword');
  const message = document.getElementById('message');

  if (!email.value || !password.value) {
    message.innerText = "Email and password are required";
    return;
  }

  fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location = "dashboard.html";
    } else {
      message.innerText = "Invalid credentials";
    }
  });
}

/* =========================
   REGISTER
========================= */
function register() {
  if (!name.value || !email.value || !password.value) {
    message.innerText = "All fields are required";
    return;
  }

  fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: password.value
    })
  })
  .then(() => {
    message.innerText = "Registration successful. Please login.";
  });
}

/* =========================
   CREATE / UPDATE TASK
========================= */
function submitTask() {
  const taskId = document.getElementById("taskId").value;
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const status = document.getElementById("status");
  const priority = document.getElementById("priority");
  const dueDate = document.getElementById("due_date");

  // ✅ FRONTEND VALIDATION
  if (!title.value.trim()) {
    alert("Title is required");
    return;
  }

  const payload = {
    title: title.value,
    description: description.value,
    status: status.value,
    priority: priority.value,
    due_date: dueDate.value || null
  };

  const method = taskId ? "PUT" : "POST";
  const url = taskId
    ? `${API_URL}/tasks/${taskId}`
    : `${API_URL}/tasks`;

  fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify(payload)
  })
  .then(res => {
    if (res.status === 401) {
      logout();
    }
    return res.json();
  })
  .then(() => {
    resetForm();
    loadTasks();
  });
}

/* =========================
   LOAD TASKS
========================= */
function loadTasks() {
  fetch(`${API_URL}/tasks`, {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(res => {
    if (res.status === 401) {
      logout();
    }
    return res.json();
  })
  .then(tasks => {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";

      li.innerHTML = `
        <div>
          <strong>${task.title}</strong><br>
          <small>${task.description || ""}</small><br>
          <span class="badge bg-info">${task.status}</span>
          <span class="badge bg-secondary">${task.priority}</span>
        </div>
        <div>
          <button class="btn btn-sm btn-warning me-2"
            onclick="editTask(${task.id}, '${task.title}', '${task.description || ""}', '${task.status}', '${task.priority}', '${task.due_date || ""}')">
            Edit
          </button>
          <button class="btn btn-sm btn-danger"
            onclick="deleteTask(${task.id})">
            Delete
          </button>
        </div>
      `;
      taskList.appendChild(li);
    });
  });
}

/* =========================
   EDIT TASK
========================= */
function editTask(id, title, description, status, priority, dueDate) {
  document.getElementById("taskId").value = id;
  document.getElementById("title").value = title;
  document.getElementById("description").value = description;
  document.getElementById("status").value = status;
  document.getElementById("priority").value = priority;
  document.getElementById("due_date").value = dueDate;
  document.getElementById("formTitle").innerText = "Edit Task";
}

/* =========================
   DELETE TASK
========================= */
function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
  .then(res => {
    if (res.status === 401) {
      logout();
    }
    loadTasks();
  });
}

/* =========================
   RESET FORM
========================= */
function resetForm() {
  document.getElementById("taskId").value = "";
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("status").value = "TODO";
  document.getElementById("priority").value = "MEDIUM";
  document.getElementById("due_date").value = "";
  document.getElementById("formTitle").innerText = "Create Task";
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("token");
  window.location = "index.html";
}

/* =========================
   AUTO LOAD TASKS
========================= */
if (window.location.pathname.includes("dashboard.html")) {
  loadTasks();
}
