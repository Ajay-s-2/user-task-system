const API = "http://localhost:5000/api";

/**
 * Safely parse JWT payload
 */
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

/**
 * LOGIN (User & Admin)
 */
function login() {
  msg.innerText = "";

  if (!email.value || !password.value) {
    msg.innerText = "Email and password are required";
    return;
  }

  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value.trim(),
      password: password.value
    })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Invalid email or password");
      }
      return res.json();
    })
    .then(data => {
      if (!data.token) {
        throw new Error("Authentication failed");
      }

      // Save token
      localStorage.setItem("token", data.token);

      const payload = parseJwt(data.token);
      if (!payload) {
        throw new Error("Invalid token received");
      }

      // Redirect based on role
      if (payload.isAdmin) {
        window.location.href = "admin.html";
      } else {
        window.location.href = "dashboard.html";
      }
    })
    .catch(err => {
      msg.innerText = err.message || "Login failed";
    });
}

/**
 * REGISTER (User only)
 */
function register() {
  msg.innerText = "";

  if (!name.value || !email.value || !password.value) {
    msg.innerText = "All fields are required";
    return;
  }

  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value
    })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Registration failed");
      }
      return res.json();
    })
    .then(() => {
      msg.innerText = "Registration successful. Please login.";
    })
    .catch(err => {
      msg.innerText = err.message || "Registration failed";
    });
}

/**
 * LOGOUT (Reusable)
 */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

/**
 * OPTIONAL: Auto logout if token expired
 * Call this on protected pages
 */
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    logout();
    return;
  }

  const payload = parseJwt(token);
  if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
    logout();
  }
}
