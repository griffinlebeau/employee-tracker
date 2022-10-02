const db = require('../db/connection')
const roles = [];
let roleId;

const viewRoles = () => {
    const sql = `SELECT roles.title, roles.salary, departments.name AS department FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id`;
    db.query(sql, (err, rows) => {
        if (err) {
        console.log(err);
    }
        console.table(rows);
    });
};


const roleChoices = () => {
    const sql = `SELECT title FROM roles`; // sql to populate roles 
    db.query(sql, (err, rows) => { // query to populate role choices 
        if (err) { 
            console.log(err);
        }
        for (let i = 0; i < rows.length; i++) {
            roles.push(rows[i]);
        };
    })
};

const getRoleId = response => {
    const sql = `SELECT id FROM roles WHERE title = ?`; // sql to get role id from choice
    const params = [response.role]; // holds role choice for id query
    db.query(sql, params, (err, row) => { // query for role choice id 
        if (err) {
            console.log(err);
        };
        roleId = row;
    });
};

module.exports = { viewRoles, roleChoices, getRoleId, roles, roleId }

