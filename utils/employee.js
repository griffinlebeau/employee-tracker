const db = require('../db/connection')

const viewEmployees = () => {
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
                        });
};

module.exports = { viewEmployees }