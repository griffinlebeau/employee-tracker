//import db from ('../server');
const getEmployees = () => {
    const sql = `SELECT first_name, last_name, role_id AS role, FROM employees
                            INNER JOIN roles ON employees.role_id = roles.id
                            INNER JOIN departments ON employees.department_id = department.id`;
            db.query(sql, (err, rows) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ 
                    message: 'success',
                    data: rows
                });
            })
}

const addEmployee = () => {

}
const updateRole = () => {

}

module.exports = { getEmployees, addEmployee, updateRole }
