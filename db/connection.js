const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'griffinlebeau',
  password: 'tobychubs',
  database: 'business'
});

module.exports = db;
