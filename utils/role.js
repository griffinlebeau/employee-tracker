const db = require('../db/connection')

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

module.exports = { viewRoles }

