INSERT INTO departments (name)
VALUES
    ('Legal'),
    ('Finance'),
    ('Service'),
    ('Management');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Software Engineer', '90000', '1'),
    ('Account Manager', '110000', '2'),
    ('Accountant', '140000', '3'),
    ('Legal Team Lead', '120000', '4');

INSERT INTO employees (last_name, first_name, role_id, manager_id)
VALUES  
    ('LeBeau', 'Griffin', '1', '2'),
    ('Sullivan', 'Kathleen', '2', '1'),
    ('Haglorf', 'Julianne', '3', '1');