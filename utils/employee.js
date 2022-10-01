const db = require('../db/connection')
const managers = [];
const employees = [];
let managerId;
let employeeId;

const viewEmployees = () => {
                        const sql = `SELECT 
                                        CONCAT(e.first_name, ', ', e.last_name) AS Employee, 
                                        CONCAT(m.first_name, ', ', m.last_name) AS Manager,
                                        roles.title AS role_title, roles.salary 
                                    FROM 
                                        employees AS e
                                    INNER JOIN employees m ON
                                        m.id = e.manager_id
                                    LEFT JOIN roles ON 
                                        e.role_id = roles.id`;
                        db.query(sql, (err, rows) => {
                            if (err) {
                                console.log(err);
                            }
                            console.table(rows);
                        });
};

const addEmployee = (response, roleId, managerId) => {
    const params = []; 
    params.push(response.first, response.last, roleId, managerId); // params for final employee creation query
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
        };
        console.table(result);
    })
};

const getEmployeeFirstLast = () => {
     // holds employee choices 
    const sql = `SELECT CONCAT(employees.first_name, ', ', employees.last_name) FROM employees`; // sql to populate employees
    db.query(sql, (err, rows) => { // query to populate employee choices 
        if (err) {
            console.log(err);

        };
        for (let i = 0; i < rows.length; i++) {
            employees.push(rows[i]);
        };
    })
};

const updateRole = (roleId, employeeId) => {
    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
    const params = [roleId, employeeId];
    db.query(sql, params, (err, result) => { // query to update the chosen employee's role
        if (err) {
            console.log(err);
        }
        console.table(result);
    })
};

const managerChoices = () => {
    const managerSql = `SELECT first_name, last_name FROM employees` // sql to populate managers
    db.query(managerSql, (err, rows) => { // query to populate manager choices 
        if (err) {
            console.log(err);
        };
        for (let i = 0; i < rows.length; i++) {
            managers.push(rows[i]);
        };
    })
};

const getEmployeeId = response => {
    const first = response.split('')[0]; // first_name to get id for manager
    const last = response.split('')[1]; // last_name to get id for manager 
    const sql = `SELECT id FROM employees WHERE first_name = ?, last_name = ?`; // sql to get manager id from choice 
    const params = [first, last]; // holds split full name for manager id query 
    db.query(sql, params, (err, row) => { // query for manager choice id 
         if (err) {
             console.log(err);
         };
         managerId = row;
     });
};


module.exports = { viewEmployees, addEmployee, updateRole, managerChoices, 
    getEmployeeId, getEmployeeId, getEmployeeFirstLast, employees, managers, managerId, employeeId }
