const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "pi2",
  //socketPath: "/tmp/mysql.sock"
  password: "@Dmin!23",     // put your MySQL password here


});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
  } else {
    console.log("MySQL connected successfully");
  }
});

module.exports = db;