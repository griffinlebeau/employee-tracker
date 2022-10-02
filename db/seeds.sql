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
    ('Harry', 'Potter', '1', '2'),
    ('Hermoine', 'Granger', '2', '1'),
    ('Ron', 'Weasley', '3', '1');