const departments = [];
let deptId;

const getDepartments = () => {
    const sql = `SELECT name FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            startApp();
        };
        console.table(rows);
        startApp();
    });
};

const addDepartment = response => {
    const sql = `INSERT INTO departments (name) VALUES (?)`;
    const params = [response.name];
    db.query(sql, params, (err, row) => {
        if (err) {
            console.log(err);
            startApp;
        };
        console.log(row);
        startApp();
    });
};

const departmentChoices = () => {
    const sql = `SELECT departments.name FROM departments`;
    db.query(sql, (err, rows) => { // query to populate department options 
        if (err) {
            console.log(err);
            startApp;
        };
        for (let i = 0; i < rows.length; i++) {
            departments.push(rows[i]);
        };
    })
};

const departmentId = response => {
    const sql = `SELECT departments.id FROM departments WHERE departments.name = ?`;
    const params = [response.dept];
    db.query(sql, params, (err, row) => { // query to retrieve department ID from user choice
        if (err) {
            console.log(err);
            startApp;
        }
        deptId = row;
    })
}
module.exports = { getDepartments, addDepartment, departmentChoices, departmentId, departments, deptId }