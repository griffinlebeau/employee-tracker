const managers = [];
let managerId;
const getEmployees = () => {
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

const addEmployee = response => {

};

const updateRole = response => {

};

const managerChoices = () => {
    const managerSql = `SELECT first_name, last_name FROM employees` // sql to populate managers
    db.query(managerSql, (err, rows) => { // query to populate manager choices 
        if (err) {
            console.log(err);
            startApp();
        };
        for (let i = 0; i < rows.length; i++) {
            managers.push(rows[i]);
        };
    })
};


module.exports = { getEmployees, addEmployee, updateRole, managerChoices, managers }
