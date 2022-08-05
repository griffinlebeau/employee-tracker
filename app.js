const inquirer = require('inquirer');
const createEmployee = require('./utils/employee');
const createDepartment = require('./utils/department');
const createRole = require('./utils/role');
const db = require('./db/connection');
const cTable = require('console.table');


inquirer.prompt(
    {
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View all department data', 'View all role data', 'View all employee data', 
        'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
    })
    .then(answers => {
        if (answers.prompt === 'View all department data'){
            const sql = `SELECT * FROM departments`;
            db.query(sql, (err, rows) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ 
                    message: 'success',
                    data: console.table(rows)
                });
            })
        }
        if (answers.prompt === 'View all role data'){
            const sql = `SELECT * FROM roles 
                            LEFT JOIN departments
                            ON roles.department_id = departments.id`;
            db.query(sql, (err, rows) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ 
                    message: 'success',
                    data: console.table(rows)
                });
            })

        }
        if (answers.prompt === 'View all employee data'){
            const sql = `SELECT * FROM employees
                            LEFT JOIN roles 
                            ON employees.role_id = roles.id`;
            db.query(sql, (err, rows) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ 
                    message: 'success',
                    data: console.table(rows)
                });
            })

        }
        if (answers.prompt === 'Add an employee'){ 
            var roles = []; //holds role choices for inquirer prompt
            var employees = []; //holds employee choices for inquirer prompt 
            var first_name = ""; //holds first name of employee to be added to table
            var last_name = ""; //holds last name of employee to be added to table
            var role_id; //holds id of role for foreign key in employee table
            var manager_id; //holds id of manager for foreign key in employee table
            db.query(`SELECT title FROM roles`, (err, rows) => { //database query to fill roles array with role titles 
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                };
                for (i = 0; i < rows.length; i++){
                    var role = rows[i].title;
                    roles.push(role)
                } 
            });
            db.query(`SELECT first_name, last_name FROM employees`, (err, rows) => { //database query to fill employees array with names for choice
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                };
                for (i = 0; i < rows.length; i++){
                    var employee = rows[i].first_name + "" + rows[i].last_name; //concantenate here for inquirer choice, then split later
                    employees.push(employee)
                }
            });
            inquirer.prompt([
                {
                    type: "input",
                    name: "first",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "last",
                    message: "What is the employee's last name?"
                },
                {
                    type: "list",
                    name: "role",
                    message: "Select the employee's role:",
                    choices: [roles] //array from previous query
                },
                {
                    type: "list",
                    name: "manager",
                    message: "Select the employee's manager",
                    choices: employees //array from previous query
                },
            ]).then(response => {
                db.query(`SELECT id FROM roles WHERE title = ${response.role}`, (err, row) => { //use role choice to get role id for foreign key
                    role_id = row;
                });
                var name = response.employee.split(" "); //split manager choice name at space which creates an array with first the first and last name
                first_name = name[0];
                last_name = name[1];
                db.query(`SELECT id FROM employees WHERE first_name = ${first_name} AND last_name = ${last_name}`, (err, row) => { //query database for matching manager foreign key id
                    manager_id = row;
                })
            })
            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`; //statement for adding employee query
            const params = [ 
                first_name, 
                last_name, 
                role_id, 
                manager_id]
            db.query(sql, params, (err, result) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({ 
                    message: 'success',
                    data: answers
                });
            })

        }
        if (answers.prompt === 'Add a department'){
            const sql = `INSERT INTO departments (name) VLAUES (?)`;
            const params = [answers.name];
            db.query(sql, params, (err, result) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({ 
                    message: 'success',
                    data: answers
                });
            })

        }
        if (answers.prompt === 'Add a role'){
            var departments = [];
            var department_id;
            var title = "";
            var salary;
            db.query(`SELECT name FROM departments`, (err, rows) => { //populates departments with choices
                for(i = 0; i < rows.length; i++){
                    var department = rows[i].name;
                    departments.push(department)
                }
            })
            inquirer.prompt([
                {
                    type: "text",
                    name: "title",
                    message: "What is the role's title?"
                },
                {
                    type: "text",
                    name: "salary",
                    message: "WHat is the role's salary?"
                },
                {
                    type: "list",
                    name: "department",
                    message: "Select the role's department:",
                    choices: departments
                }
            ]).then(response => {
                db.query(`SELECT id FROM departments WHERE name = ${response.department}`, (err, row) => { //sets id to chosen department id
                    department_id = row.id;
                });
                title = response.title;
                salary = response.salary;
            })
            const sql =`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
            const params = [
                title, 
                salary,
                department_id    
            ];
            db.query(sql, params, (err, result) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({
                    message: 'success',
                    data: result
                });
            })

            
        }
        if (answers.prompt === 'Update an employee role'){
            var employees = [];
            var roles = [];
            var employee_id;
            var role_id;
            db.query(`SELECT first_name, last_name FROM employees`, (err, rows) => { // populate employees choices array
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                };
                for (i = 0; i < rows.length; i++){
                    var employee = rows[i].first_name + "" + rows[i].last_name;
                    employees.push(employee)
                }
            });
            inquirer.prompt( // employee selection prompt
                {
                    type: "input",
                    name: "employee",
                    message: "Select an employee:",
                    choices: employees
                },
            ).then(response => { 
                var name = response.employee.split(" ");
                var first_name = name[0];
                var last_name = name[1];
                db.query(`SELECT id FROM employees WHERE first_name = ${first_name} AND last_name = ${last_name}`, (err, row) => { // get employee id from selection for update query
                    employee_id = row;})
                db.query(`SELECT title FROM roles`, (err, rows) => { // populate roles array
                    for(i = 0; i < rows.length; i++){
                        var role = row[i].title;
                        roles.push(role);
                        }
                })
                inquirer.prompt( // roles selection prompt
                    {
                        type: "list",
                        name: "role",
                        message: "Select the new role for the employee",
                        choices: roles,
                    }
                ).then(response => {
                    db.query(`SELECT id FROM roles WHERE title = ${response.role}`, (err, row) => { // get row id from selection
                        role_id = row.id
                    })
                    db.query(`UPDATE employees SET role_id = ${row_id} WHERE id = ${employee_id}`, (err, result) => { // update role query
                        if (err) {
                            res.status(400).json({ error: err.message });
                            return;
                        }
                        res.json({ 
                            message: 'success',
                            data: result
                        });
                    })
                })
            })

        }
    })