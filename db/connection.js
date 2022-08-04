const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'griffinlebeau',
  // Your MySQL password
  password: 'tobychubs',
  database: 'business'
});

module.exports = db;
