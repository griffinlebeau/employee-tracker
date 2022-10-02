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
                        roleChoices();//populate role choices array
                        managerChoices();//populate manager choices array
                        inquirer.prompt( 
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
                        getRoleId(response.role);//role id from choice
                        getEmployeeId(response.manager);//employee id for manager from choice
                        addEmployee(response, roleId, managerId);
                        startApp();
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
                        roleChoices();
                        getEmployeeFirstLast();
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
                            getEmployeeId(response.employee);
                            getRoleId(response.role);
                            updateRole(roleId, employeeId);
                            startApp();
                        })
                    }
                    if (response.main === mainChoices[7]) { // exit app
                        process.exit(0);
                        }
                })
}

module.exports = startApp();

