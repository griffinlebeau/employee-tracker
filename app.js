const inquirer = require('inquirer');
const db = require('./db/connection');
const stopApp = require('./server');
const mainChoices = ['View all employees', 'View all roles', 'View all departments', 'Add an employee', 'Add a role', 'Add a department', 'Update an Employee role', 'Quit'];


const startApp = () => {
    inquirer.prompt(
                {
                    name: 'main',
                    type: 'list',
                    message: 'What would you like to do?',
                    choices: mainChoices,
                }
                ).then(response => {
                    if (response.main === mainChoices[0]) { //view all employees
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
                                startApp();
                            }
                            console.table(rows);
                        });
                    };
                    if (response.main === mainChoices[1]) { //view all roles
                        const sql = `SELECT roles.title, roles.salary, departments.name AS department FROM roles
                                     LEFT JOIN departments ON roles.department_id = departments.id`;
                        db.query(sql, (err, rows) => {
                            if (err) {
                                console.log(err);
                                startApp();
                            }
                            console.table(rows);
                        });
                    }
                    if (response.main === mainChoices[2]) { //view all departments 
                        const sql = `SELECT name FROM departments`;
                        db.query(sql, (err, rows) => {
                            if (err) {
                                console.log(err);
                                startApp();
                            };
                            console.table(rows);
                            startApp();
                        });
                    }
                    if (response.main === mainChoices[3]) { //add an employee
                        const employeeParams = []; // holds parameters for employee creation 
                        const roles = []; // holds role choices
                        const managers = []; // holds manager choices 
                        const roleSql = `SELECT roles.title FROM roles`; // sql to populate roles 
                        const managerSql = `SELECT CONCAT(employees.first_name, ', ', employees.last_name) FROM employees` // sql to populate managers
                        db.query(roleSql, (err, rows) => { // query to populate role choices 
                            if (err) { 
                                console.log(err);
                                startApp;
                            }
                            for (let i = 0; i < rows.length; i++) {
                                roles.push(rows[i]);
                            };
                        })
                        db.query(managerSql, (err, rows) => { // query to populate manager choices 
                            if (err) {
                                console.log(err);

                            };
                            for (let i = 0; i < rows.length; i++) {
                                managers.push(rows[i]);
                            };
                        })
                        inquirer.prompt( // main employee creation prompt
                            {
                                name: 'first',
                                type: 'input',
                                message: 'What is the first name of the employee?'
                            },
                            {
                                name: 'last',
                                type: 'input',
                                message: 'What is the last name of the employee?'
                            },
                            {
                                name: 'role',
                                type: 'list',
                                message: 'Select a role for the employee:',
                                choices: roles
                            },
                            {
                                name: 'manager',
                                type: 'list',
                                message: 'Select the manager of the employee:',
                                choices: managers
                            }
                        ).then(response => {
                            const roleId = ''; // holds role id for employee insertion 
                            const managerId = ''; // holds manager id for employee insertion 
                            const first = response.manager.split('')[0]; // first_name to get id for manager
                            const last = response.manager.split('')[1]; // last_name to get id for manager 
                            const roleIdSql = `SELECT roles.id FROM roles WHERE title = ?`; // sql to get role id from choice
                            const managerIdSql = `SELECT employees.id FROM employees WHERE first_name = ?, last_name = ?`; // sql to get manager id from choice 
                            const roleParams = [response.role]; // holds role choice for id query
                            const managerParams = [first, last]; // holds split full name for manager id query 
                            db.query(roleIdSql, roleParams, (err, row) => { // query for role choice id 
                                if (err) {
                                    console.log(err);
                                    startApp;
                                };
                                roleId = row;
                            });
                            db.query(managerIdSql, managerParams, (err, row) => { // query for manager choice id 
                                if (err) {
                                    console.log(err);
                                    startApp;
                                };
                                managerId = row;
                            });
                            employeeParams.push(response.first, response.last, roleId, managerId); // params for final employee creation query
                            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
                            db.query(sql, employeeParams, (err, result) => {
                                if (err) {
                                    console.log(err);
                                    startApp;
                                };
                                console.table(result);
                            })
                        })
                    }
                    if (response.main === mainChoices[4]) { //add a role
                        const roleParams = [];
                        const departments = [];
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
                        inquirer.prompt( //add role prompt
                            {
                                name: 'title',
                                type: 'input',
                                message: 'What is the title of the role?'
                            },
                            {
                                name: 'salary',
                                type: 'input',
                                message: 'What is the salary of the role?'
                            },
                            {
                                name: 'dept',
                                type: 'list',
                                message: 'Which department does the role belong to?',
                                choices: departments
                            }
                        ).then(response => {
                            const sql = `SELECT departments.id FROM departments WHERE departments.name = ?`;
                            const params = [response.dept];
                            db.query(sql, params, (err, row) => { // query to retrieve department ID from user choice
                                if (err) {
                                    console.log(err);
                                    startApp;
                                }
                                roleParams.push(response.title, response.salary, row);
                            })
                            const addRole = `INSET INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
                            db.query(addRole, roleParams, (err, result) => { // query to create new role
                                if (err) {
                                    console.log(err);
                                    startApp;
                                };
                                console.table(result);
                            });
                        })
                        
                    }
                    if (response.main === mainChoices[5]) { //add a department
                        inquirer.prompt(
                            {
                                name: 'name',
                                type: 'input',
                                message: 'What is the name of the department?'
                            }
                        ).then(response => {
                            const sql = `INSERT INTO departments (name) VALUES (?)`;
                            const params = [response.name];
                            db.query(sql, params, (err, result) => {
                                if (err) {
                                    console.log(err);
                                    startApp;
                                };
                                console.log(result);
                            });
                        })
                    }
                    if (response.main === mainChoices[6]) { //update employee role
                        const employees = []; // holds employee choices 
                        const employeeSql = `SELECT CONCAT(employees.first_name, ', ', employees.last_name) FROM employees`; // sql to populate employees
                        db.query(employeeSql, (err, rows) => { // query to populate employee choices 
                            if (err) {
                                console.log(err);

                            };
                            for (let i = 0; i < rows.length; i++) {
                                employees.push(rows[i]);
                            };
                        })
                        const roles = [];
                        const roleSql = `SELECT roles.title FROM roles`; // sql to populate roles
                        db.query(roleSql, (err, rows) => { // query to populate role choices 
                            if (err) { 
                                console.log(err);
                                startApp;
                            }
                            for (let i = 0; i < rows.length; i++) {
                                roles.push(rows[i]);
                            };
                        })
                        inquirer.prompt(
                            {
                                name: 'employee',
                                type: 'list',
                                message: 'Select the employee you wish to update:',
                                choices: employees
                            },
                            {
                                name: 'role',
                                type: 'list',
                                message: 'Select the new role:',
                                choices: roles
                            }
                        ).then(response => {
                            const updateParams = [];
                            const first = response.employee.split('')[0]; // first_name to get id for employee
                            const last = response.employee.split('')[1]; // last_name to get id for employee 
                            const roleIdSql = `SELECT roles.id FROM roles WHERE title = ?`; // sql to get role id from choice
                            const employeeIdSql = `SELECT employees.id FROM employees WHERE first_name = ?, last_name = ?`; // sql to get employee id from choice 
                            const updateSql = `UPDATE employees SET role_id = ? WHERE id = ?`;
                            const roleIdParams = [response.role]; // holds role choice for id query
                            const employeeIdParams = [first, last]; // holds split full name for employee id query 
                            db.query(roleIdSql, roleIdParams, (err, row) => { // query for role choice id 
                                if (err) {
                                    console.log(err);
                                    startApp;
                                };
                                updateParams.push(row);
                            });
                            db.query(employeeIdSql, employeeIdParams, (err, row) => { // query for employee choice id 
                                if (err) {
                                    console.log(err);
                                    startApp;
                                };
                                updateParams.push(row);
                            });
                            db.query(updateSql, updateParams, (err, result) => { // query to update the chosen employee's role
                                if (err) {
                                    console.log(err);
                                    startApp;
                                }
                                console.table(result);
                            })

                        })
                    }
                    if (response.main === mainChoices[7]) { // exit app
                        stopApp;
                    }
                })
}


module.exports = startApp();