-- department table
INSERT INTO department (dept) VALUES ('sales');
INSERT INTO department (dept) VALUES ('engineering');
INSERT INTO department (dept) VALUES ('finance');
INSERT INTO department (dept) VALUES ('legal');

-- role table
INSERT INTO role (title, salary, dept_id) VALUES ('IT', 90000, 1);
INSERT INTO role (title, salary, dept_id)  VALUES ('Intern', 90000, 4);
INSERT INTO role (title, salary, dept_id)  VALUES ('Engineer', 90000, 2);
INSERT INTO role (title, salary, dept_id)  VALUES ('Accountant', 85000, 3);

-- employee table
INSERT INTO employee (first_name, last_name, role_id) values ('Jane', 'Austen', 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Mark', 'Twain', 2, 1);
INSERT INTO employee (first_name, last_name, role_id) values ('Lewis', 'Carroll', 3);
INSERT INTO employee (first_name, last_name, role_id) values ('Andre', 'Asselin', 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Jill', 'Tchaikovsky', 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Debbie', 'Smith', 3, 1);
INSERT INTO employee (first_name, last_name, role_id) values ('Thomas', 'Motorola', 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Darcy', 'Antone', 1, 1);