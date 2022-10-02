const db = require('../db/connection');

const viewDepartments = () => {
    const sql = `SELECT name FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        };
        console.table(rows);
    });
};

const addDepartment = response => {
    const sql = `INSERT INTO departments (name) VALUES (?)`;
    const params = [response.name];
    db.query(sql, params, (err, row) => {
        if (err) {
            console.log(err);
        };
        console.log(row);
    });
};





module.exports = { viewDepartments, addDepartment }