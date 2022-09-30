const inquirer = require('inquirer');
const db = require('./db/connection');
const stopApp = require('./server');
const { getDepartments, addDepartment, departments, departmentChoices, departmentId, deptId } = require('./utils/department');
const { getRoles, addRole, roleChoices, roles, roleId } = require('./utils/role');
const { getEmployees, addEmployee, updateRole, managers, managerChoices, managerId } = require('./utils/employee');
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
                        getEmployees();
                        startApp();
                    };
                    if (response.main === mainChoices[1]) { //view all roles
                        getRoles();
                        startApp();
                    }
                    if (response.main === mainChoices[2]) { //view all departments 
                        getDepartments();
                        startApp();
                    }
                    if (response.main === mainChoices[3]) { //add an employee
                        const employeeParams = []; // holds parameters for employee creation 
                        roleChoices();
                        managerChoices();
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
                            let roleId = ''; // holds role id for employee insertion 
                            let managerId = ''; // holds manager id for employee insertion 
                            const first = response.manager.split('')[0]; // first_name to get id for manager
                            const last = response.manager.split('')[1]; // last_name to get id for manager 
                            const roleIdSql = `SELECT id FROM roles WHERE title = ?`; // sql to get role id from choice
                            const managerIdSql = `SELECT id FROM employees WHERE first_name = ?, last_name = ?`; // sql to get manager id from choice 
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
                                startApp();
                            })
                        })
                    }
                    if (response.main === mainChoices[4]) { //add a role
                        departmentChoices();
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
                            departmentId(response);
                            const roleParams = [];
                            roleParams.push(response.title, response.salary, deptId);
                            const addRoleSql = `INSET INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
                            db.query(addRoleSql, roleParams, (err, result) => { // query to create new role
                                if (err) {
                                    console.log(err);
                                    startApp;
                                };
                                console.table(result);
                                startApp();
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
                            addDepartment(response);
                            startApp();
                        })
                    }
                    if (response.main === mainChoices[6]) { //update employee role
                        const employees = []; // holds employee choices 
                        const employeeSql = `SELECT CONCAT(employees.first_name, ', ', employees.last_name) FROM employees`; // sql to populate employees
                        db.query(employeeSql, (err, rows) => { // query to populate employee choices 
                            if (err) {
                                console.log(err);
                                startApp();

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
                                startApp();
                            })

                        })
                    }
                    if (response.main === mainChoices[7]) { // exit app
                        stopApp;
                    }
                })
}


