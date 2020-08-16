const mysql = require("mysql");
const Sequelize = require('sequelize');
require('dotenv').config();

/*const con = mysql.createConnection({
	  host: process.env.DB_HOST,
	  user: process.env.DB_USER,
	  password: process.env.DB_PASS || '',
	  database: process.env.DB_NAME
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});*/


const con = new Sequelize(process.env.DB_NAME, process.env.DB_USER, (process.env.DB_PASS || ''), {
    dialect: "mysql",
    port:    3306,
  });

con
.authenticate()
.then(function(err) {
  console.log('Connection has been established successfully.');
}, function (err) { 
  console.log('Unable to connect to the database:', err);
});

module.exports = con;
