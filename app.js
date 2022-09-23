const inquirer = require('inquirer');
const db = require('./db/connection');
const mainChoices = ['View all employees', 'View all roles', 'View all departments', 'Add an employee', 'Add a role', 'Add a department', 'Update an Employee"s role'];


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
                        const sql = `SELECT * FROM employees
                                     LEFT JOIN roles ON employees.role_id = roles.id
                                     LEFT JOIN employees ON employees.manager_id = employees.id`;
                        db.query(sql, (err, rows) => {
                            if (err) {
                                console.log(err);
                                startApp();
                            }
                            console.table(rows);
                        });
                    };
                    if (response.main === mainChoices[1]) { //view all roles
                        const sql = `SELECT * FROM roles
                                     LEFT JOIN departments ON roles.department_id = department.id`;
                        db.query(sql, (err, rows) => {
                            if (err) {
                                console.log(err);
                                startApp();
                            }
                            console.table(rows);
                        });
                    }
                    if (response.main === mainChoices[2]) { //view all departments 
                        const sql = `SELECT * FROM departments`;
                        db.query(sql, (err, rows) => {
                            if (err) {
                                console.log(err);
                                startApp();
                            }
                            console.table(rows);
                        });
                    }
                    if (response.main === mainChoices[3]) { //add an employee
                        
                    }
                    if (response.main === mainChoices[4]) { //add a role
                        
                    }
                    if (response.main === mainChoices[5]) { //add a department
                        
                    }
                    if (response.main === mainChoices[6]) { //update employee role
                        
                    }
                })
}


module.exports = startApp()