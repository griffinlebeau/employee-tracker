const inquirer = require('inquirer');
const db = require('./db/connection');
const { viewDepartments, addDepartment } = require('./utils/department');
const { viewRoles, roleChoices, getRoleId, roles, roleId } = require('./utils/role');
const { viewEmployees, addEmployee, updateRole, managers, managerChoices, getEmployeeId, managerId, getEmployeeFirstLast, employees, employeeId } = require('./utils/employee');
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
                        viewEmployees();
                        startApp();
                    };
                    if (response.main === mainChoices[1]) { //view all roles
                        viewRoles();
                        startApp();
                    }
                    if (response.main === mainChoices[2]) { //view all departments 
                        viewDepartments();
                        startApp();
                    }
                    if (response.main === mainChoices[3]) { //add an employee
                        let roles = [];
                        let managers = [];
                        const roleSql = `SELECT title FROM roles`; // sql to populate roles 
                        db.query(roleSql, (err, rows) => { // query to populate role choices 
                            if (err) { 
                                console.log(err);
                            }
                            for (let i = 0; i < rows.length; i++) {
                                roles.push(rows[i].title);
                            };
                        })
                        const managerSql = `SELECT first_name, last_name FROM employees` // sql to populate managers
                        db.query(managerSql, (err, rows) => { // query to populate manager choices 
                            if (err) {
                                console.log(err);
                            };
                            for (let i = 0; i < rows.length; i++) {
                                const name = rows[i].first_name + ' ' + rows[i].last_name
                                managers.push(name);
                            };
                        })
                        inquirer.prompt([
                            {
                                name: 'first_name',
                                type: 'input',
                                message: 'What is the first name of the employee?'
                            },
                            {
                                name: 'last_name',
                                type: 'input',
                                message: 'What is the last name of the employee?'
                            },
                            {
                                name: 'role_id',
                                type: 'list',
                                message: 'Select a role for the employee:',
                                choices: roles
                            },
                            {
                                name: 'manager_id',
                                type: 'list',
                                message: 'Select the manager of the employee:',
                                choices: managers
                            }
                        ]).then(response => {
                            const roleSql = `SELECT id FROM roles WHERE title = ?`; // sql to get role id from choice
                            const roleParams = [response.role_id]; // holds role choice for id query
                            db.query(roleSql, roleParams, (err, row) => { // query for role choice id 
                                if (err) {
                                    console.log(err);
                                };
                                response.role_id = row[0].id;
                                const first = response.manager_id.split(' ')[0]; // first_name to get id for manager
                                const last = response.manager_id.split(' ')[1]; // last_name to get id for manager 
                                const managerSql = `SELECT id FROM employees WHERE first_name = ? AND last_name = ?`; // sql to get manager id from choice 
                                const managerParams = [first, last]; // holds split full name for manager id query 
                                db.query(managerSql, managerParams, (err, row) => { // query for manager choice id 
                                     if (err) {
                                         console.log(err);
                                     };
                                    response.manager_id = row[0].id;   
                                    const insertParams = []
                                    insertParams.push(response.first_name, response.last_name, response.role_id, response.manager_id)
                                    const insertSql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
                                    db.query(insertSql, insertParams, (err, result) => {
                                        if (err) {
                                            console.log(err);
                                        };
                                        const sql = `SELECT 
                                                CONCAT(e.first_name, ' ', e.last_name) AS Employee, 
                                                CONCAT(m.first_name, ' ', m.last_name) AS Manager,
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
                                                startApp();
                                            });
                                        })                       
                                 });
                            });
                        })
                    }
                    if (response.main === mainChoices[4]) { //add a role
                        let departments = [];
                        const sql = `SELECT name FROM departments`;
                        db.query(sql, (err, rows) => { // query to populate department options 
                            if (err) {
                                console.log(err);
                            } else {
                                for (let i = 0; i < rows.length; i++) {
                                    departments.push(rows[i].name);
                        
                                };
                            }
                        });
                        inquirer.prompt([
                            {
                                name: 'title',
                                type: 'input', 
                                message: 'What is the title of the role?',
                            },
                            {
                                name: 'salary',
                                type: 'input',
                                message: 'What is the salary of the role?'
                            },
                            {
                                name: 'department_id',
                                type: 'list',
                                message: 'Which department does the role belong to?',
                                choices: departments,
                            }
                        ]).then(response => {
                            const sql = `SELECT departments.id FROM departments WHERE departments.name = ?`;
                            const params = [response.department_id];
                            db.query(sql, params, (err, row) => { // query to retrieve department ID from user choice
                                if (err) {
                                    console.log(err);
                                }
                                response.department_id = row[0].id
                                const params = [];
                                const salary = parseInt(response.salary);
                                params.push(response.title, salary, response.department_id)
                                const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
                                db.query(sql, params, (err, result) => { // query to create new role
                                    if (err) {
                                        console.log(err);
                                    };
                                    const sql = `SELECT roles.title, roles.salary, departments.name AS department FROM roles
                                    LEFT JOIN departments ON roles.department_id = departments.id`;
                                    db.query(sql, (err, rows) => {
                                        if (err) {
                                        console.log(err);
                                    }
                                        console.table(rows);
                                        startApp();                    
                                    });
                                });
                            }) 
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
                            addDepartment(response);
                            startApp();
                        })
                    }
                    if (response.main === mainChoices[6]) { //update employee role
                        let roles = [];
                        let managers = [];
                        const roleSql = `SELECT title FROM roles`; // sql to populate roles 
                        db.query(roleSql, (err, rows) => { // query to populate role choices 
                            if (err) { 
                                console.log(err);
                            }
                            for (let i = 0; i < rows.length; i++) {
                                roles.push(rows[i].title);
                            };
                            const managerSql = `SELECT first_name, last_name FROM employees` // sql to populate managers
                            db.query(managerSql, (err, rows) => { // query to populate manager choices 
                                if (err) {
                                    console.log(err);
                                };
                                for (let i = 0; i < rows.length; i++) {
                                    const name = rows[i].first_name + ' ' + rows[i].last_name
                                    managers.push(name);
                                };
                                inquirer.prompt([
                                    {
                                        name: 'employee_id',
                                        type: 'list',
                                        message: 'Select the employee you wish to update:',
                                        choices: managers
                                    },
                                    {
                                        name: 'role_id',
                                        type: 'list',
                                        message: 'Select the new role:',
                                        choices: roles
                                    }
                                ]).then(response => {
                                    const first = response.employee_id.split(' ')[0]; // first_name to get id for manager
                                    const last = response.employee_id.split(' ')[1]; // last_name to get id for manager 
                                    const employeeSql = `SELECT id FROM employees WHERE first_name = ? AND last_name = ?`; // sql to get manager id from choice 
                                    const employeeParams = [first, last]; // holds split full name for manager id query 
                                    db.query(employeeSql, employeeParams, (err, row) => { // query for manager choice id 
                                         if (err) {
                                             console.log(err);
                                         };
                                        response.employee_id = row[0].id;                               
                                        const roleSql = `SELECT id FROM roles WHERE title = ?`; // sql to get role id from choice
                                        const roleParams = [response.role_id]; // holds role choice for id query
                                        db.query(roleSql, roleParams, (err, row) => { // query for role choice id 
                                            if (err) {
                                                console.log(err);
                                            };
                                            response.role_id = row[0].id;                            
                                            const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
                                            const params = [response.role_id, response.employee_id];
                                            db.query(sql, params, (err, result) => { // query to update the chosen employee's role
                                                if (err) {
                                                    console.log(err);
                                                }
                                                const sql = `SELECT 
                                                                CONCAT(e.first_name, ' ', e.last_name) AS Employee, 
                                                                CONCAT(m.first_name, ' ', m.last_name) AS Manager,
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
                                                                startApp();
                                                            });                                    
                                                        })                        
                                                })
                                            })
                                        })
                            })
                        }) 
                    }
                    if (response.main === mainChoices[7]) { // exit app
                        console.log('Goodbye!');
                        process.exit(0);
                        }
                })
}

module.exports = startApp();

