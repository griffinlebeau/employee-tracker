const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'griffinlebeau',
  password: '',
  database: 'business'
});

module.exports = db;
