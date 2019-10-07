var mysql = require("mysql");

//Connection with the user, password and DB created on mysql
// function getConnection() {
//   var connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "password@1234",
//     database: "grubhub",
//     port: 3306
//   });
//   return connection;

var pool = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  user: "root",
  password: "password",
  database: "grubhub",
  port: 3306,
  debug: false,
  multipleStatements: true
});

module.exports = pool;
