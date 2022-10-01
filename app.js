const inquirer = require('inquirer');
const stopApp = require('./server');
const { viewDepartments, addDepartment, departments, departmentChoices, getdepartmentId, deptId } = require('./utils/department');
const { viewRoles, addRole, roleChoices, getRoleId, roles, roleId } = require('./utils/role');
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
                        departmentChoices();
                        console.log(departments);
                        inquirer.prompt( //add role prompt
                            {
                                name: 'dept',
                                type: 'list',
                                message: 'Which department does the role belong to?',
                                choices: departments
                            },
                            {
                                name: 'title',
                                type: 'input',
                                message: 'What is the title of the role?'
                            },
                            {
                                name: 'salary',
                                type: 'input',
                                message: 'What is the salary of the role?'
                            }
                        ).then(response => {
                            getdepartmentId(response);//get department id from choice
                            addRole(response, deptId)
                            startApp();
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
                        stopApp;
                    }
                })
}

module.exports = startApp();
