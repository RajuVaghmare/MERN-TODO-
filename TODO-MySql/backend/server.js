const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// MySql configuration
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "",
});

// Connection to MySql
conn.connect(function (err) {
  if (err) {
    throw err;
  }
  console.log("Connected to MySql");

   // Creates the database if it does not exist
   conn.query("CREATE DATABASE IF NOT EXISTS todolist", (err) => {
    if (err) {
      console.error("Error creating database:", err);
    } else {
      console.log("Database created or already exists");

      // Switches to the 'todolist' database
      conn.query("USE todolist");

  // Creates tasks table if not exists
  const createTableQuery =
    "CREATE TABLE IF NOT EXISTS tasks (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(20))";
  conn.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating tasks table:", err);
    } else {
      console.log("Tasks table created or already exists");
    }
  });
}
});
});

// Route to retrieve tasks from the database
app.get("/api/tasks", (req, res) => {
  const query = "SELECT * FROM tasks";
  conn.query(query, (err, results) => {
    if (err) {
      console.error("Error getting tasks:", err);
      res.status(500).json({ error: "Failed to get tasks" });
    } else {
      res.json(results);
    }
  });
});

// Route to add a new task to the database
app.post("/api/tasks", (req, res) => {
  const { name } = req.body;
  const query = "INSERT INTO tasks (name) VALUES (?)";
  conn.query(query, [name], (err, results) => {
    if (err) {
      console.error("Error adding task:", err);
      res.status(500).json({ error: "Failed to add task" });
    } else {
      const insertedId = results.insertId;
      res.json({ success: true, id: insertedId });
    }
  });
});

// Route to delete a task from the database
app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM tasks WHERE id = ?";
  conn.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting task:", err);
      res.status(500).json({ error: "Failed to delete task" });
    } else {
      res.json({ success: true });
    }
  });
});

// Starts the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
