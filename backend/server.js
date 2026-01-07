const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

/* ======================
   ROUTES
====================== */
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/tasks", require("./src/routes/task.routes"));
app.use("/api/admin", require("./src/routes/admin.user.routes"));
app.use("/api/admin", require("./src/routes/admin.task.routes"));


/* ======================
   HEALTH CHECK (OPTIONAL)
====================== */
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
