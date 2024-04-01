const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Template engine
const handleBars = exphbs.create({ extname: ".hbs" });
app.engine("hbs", handleBars.engine);
app.set("view engine", "hbs");

// MySQL connection
const conn = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "@syfon288",
  database: "gym",
});

// Check database connection
conn.getConnection((err, connection) => {
  if (err) throw err;
  console.log("MySql connected successfully");
});

// Routers
app.get("/", (req, res) => {
  conn.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("SELECT * FROM users", (err, rows) => {
      connection.release();
      if (!err) {
        res.render("home", { rows });
      } else {
        console.log("Error in retrieving data " + err);
      }
    });
  });
});

app.get("/addUser", (req, res) => {
  res.render("addUser");
});

app.post("/addUser", (req, res) => {
  conn.getConnection((err, connection) => {
    if (err) throw err;
    const { name, age, weight } = req.body;
    connection.query(
      "INSERT INTO users (NAME, AGE, weight) VALUES (?, ?, ?)",
      [name, age, weight],
      (err, result) => {
        connection.release();
        if (!err) {
          res.render("addUser", { msg: "User details added successfully" });
        } else {
          console.log("Error in adding data " + err);
        }
      }
    );
  });
});

app.get("/editUser/:id", (req, res) => {
  conn.getConnection((err, connection) => {
    if (err) throw err;
    const { id } = req.params;
    connection.query("SELECT * FROM users WHERE id = ?", [id], (err, rows) => {
      connection.release();
      if (!err) {
        res.render("editUser", { rows });
      } else {
        console.log("Error in retrieving data " + err);
      }
    });
  });
});

app.post("/editUser/:id", (req, res) => {
  conn.getConnection((err, connection) => {
    if (err) throw err;
    const { id } = req.params;
    const { name, age, weight } = req.body;
    connection.query(
      "UPDATE users SET NAME = ?, AGE = ?, weight = ? WHERE ID = ?",
      [name, age, weight, id],
      (err, result) => {
        connection.release();
        if (!err) {
          res.render("editUser", {
            msg: "User details updated successfully",
          });
        } else {
          console.log("Error in updating data " + err);
        }
      }
    );
  });
});

app.get("/deleteUser/:id", (req, res) => {
  conn.getConnection((err, connection) => {
    if (err) throw err;
    const { id } = req.params;
    connection.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
      connection.release();
      if (!err) {
        res.redirect("/");
      } else {
        console.log("Error in deleting data " + err);
      }
    });
  });
});

// Start server
app.listen(port, () => {
  console.log("Server running on localhost " + port);
});
