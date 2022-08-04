const inquirer = require('inquirer');
const createEmployee = require('./utils/employee');
const createDepartment = require('./utils/department');
const createRole = require('./utils/role');
const db = require('./db/connection');

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
                    data:rows
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
                    data:rows
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
                    data:rows
                });
            })

        }
        if (answers.prompt === 'Add an employee'){
            const sql = `INSERT INTO employees (first_name, last_name) VALUES (?, ?)`;
            const params = [
                answers.first_name, 
                answers.last_name, 
                answers.role, 
                answers.manager];
            db.query(sql, params, (err, result) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({ 
                    message: 'success',
                    data:answers
                });
            })

        }
        if (answers.prompt === 'Add a department'){
            const sql = `INSERT INTO departments (name) VLAUES (?)`;
            const params = [answers.name];
            db.query(sq, params, (err, result) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({ 
                    message: 'success',
                    data:answers
                });
            })

        }
        if (answers.prompt === 'Add a role'){

            
        }
        if (answers.prompt === 'Update an employee role'){

        }
    })