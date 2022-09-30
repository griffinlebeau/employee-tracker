const roles = [];
let roleId;

const getRoles = () => {
    const sql = `SELECT roles.title, roles.salary, departments.name AS department FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id`;
    db.query(sql, (err, rows) => {
        if (err) {
        console.log(err);
    }
        console.table(rows);
    });
};

const addRole = response => {

};

const roleChoices = () => {
    const roleSql = `SELECT title FROM roles`; // sql to populate roles 
    db.query(roleSql, (err, rows) => { // query to populate role choices 
        if (err) { 
            console.log(err);
            startApp();
        }
        for (let i = 0; i < rows.length; i++) {
            roles.push(rows[i]);
        };
    })
};

module.exports = { getRoles, addRole, roleChoices, roles }

