const express = require("express");// express framework
const cors = require("cors");// front to back communication
const path = require("path");// url path handling

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/tasks", require("./src/routes/task.routes"));
app.use("/api/admin", require("./src/routes/admin.user.routes"));
app.use(require("./src/middlewares/error.middleware"));


module.exports = app;
