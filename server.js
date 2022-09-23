const express = require('express');
const db = require('./db/connection')
const startApp = require('./app.js')
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.connect();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const stopApp = () => {
  app.close();
  db.destroy;
}

startApp;

module.exports = stopApp()

