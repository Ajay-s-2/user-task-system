require("dotenv").config();

const app = require("./app");
const db = require("./src/config/db");

const PORT = process.env.PORT || 5000;

db.query("SELECT 1")
  .then(() => {
    console.log("MySQL connected");
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` http://localhost:${PORT}`);

    });
  })
  .catch((err) => {
    console.error("MySQL connection failed");
    console.error(err.message);
    process.exit(1);
  });
