const connection = require("./assets/js/connection");
const inquirer = require("inquirer");
const questions = require("./assets/js/questions");
// const logo = require('asciiart-logo');
// const config = require('./package.json');
// console.log(logo(config).render());

// Start our application
init();

async function init() {
  const { action } = await inquirer.prompt(questions);
  switch (action) {
    case "Edit Department":
      editDepartments();
      break;
    case "Edit Employee Role":
      editRole();
      break;
    case "Edit Employee":
      editEmployee();
      break;
    case "View Information":
      viewInfo();
      break;
    case "Exit":
      process.exit(0);
      break;
    default:
      break;
  }
}
/////////////////////////////////////////////////////////////////////////////////////
// Edit department functions
async function editDepartments() {
  const { department } = await inquirer.prompt({
    name: "department",
    type: "list",
    message: "Choose one of the following:",
    choices: [
      "Add Department",
      "Remove Department",
      "Exit"
    ]
  })
  if (department === "Add Department") {
    addDepartment();
  }
  if (department === "Remove Department") {
    remDepartment();
  }
  if (department === "Exit") {
    init();
  }
};
///////////////////////////////////////////////
////add department function
async function addDepartment() {
  const departmentName = await inquirer.prompt({
    name: "department",
    type: "input",
    message: "What department are you adding",
  });

  const data = departmentName.department

  const query = await connection.query(
    "INSERT INTO department SET ?",
    {
      dept: data,
    },

    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " Department Added\n");
      init();
    });
}
//////////////////////////////////////////////////
////remove department function
async function remDepartment() {
  connection.query(
    "SELECT dept AS departments FROM department",
    async function (err, departments) {
      const data = await inquirer.prompt([
        {
          name: "departments",
          message: "What department would you like to remove?",
          type: "list",
          choices: departments.map((department) => ({
            name: department.departments,
          })),
        },
      ]);
      connection.query(
        "DELETE FROM department WHERE ?", {
        dept: data.departments,
      }),
        init();
    }
  );
}
/////////////////////////////////////////////////////////////////////////////////////
//start of edit employee
async function editEmployee() {
  const { employee } = await inquirer.prompt({
    name: "employee",
    type: "list",
    message: "What would you like to do?",
    choices: ["Add Employee", "Remove Employee", "Exit"],
  });
  if (employee === "Add Employee") {
    addEmployee();
  } else if (employee === "Remove Employee") {
    removeEmployee();
  } else {
    init();
  }
}

///////////////////////////////////////////////////////////////////
//// Add employee function
async function addEmployee() {
  const add = await inquirer.prompt([
    {
      name: "firstName",
      type: "input",
      message: "What is the employee's first name?",
    },
    {
      name: "lastName",
      type: "input",
      message: "What is the employee's last name?",
    },
    {
      name: "roleID",
      type: "list",
      message: "What is the employee's role?",
      choices: [
        "Intern",
        "IT",
        "Janitor",
      ]
    },
    {
      name: "managerID",
      type: "confirm",
      message: "Is the employee a manager?",
    },
  ]);
  switch (add.managerID) {
    case true:
      add.managerID = 1;
      break;
    case false:
      add.managerID = null;
      break;
  }
  const query = await connection.query(
    "INSERT INTO employee SET ?",
    {
      first_name: add.firstName,
      last_name: add.lastName,
      role_id: add.roleID,
      manager_id: add.managerID,
    },

    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " Employee Added\n");
      init();
    });
}

////////////////////////////////////////////////////////////////////
////////Employee remove function
async function removeEmployee() {
  connection.query(
    "SELECT first_name AS firstName, last_name AS lastName FROM employee",
    async function (err, employees) {
      const data = await inquirer.prompt([
        {
          name: "employees",
          message: "Which employee would you like to remove?",
          type: "list",
          choices: employees.map((employee) => ({
            name: employee.firstName + " " + employee.lastName,
          })),
        },
      ]);
      console.log(data);
      const firstAndLast = data.employees.split(" ");
      console.log(firstAndLast[1]);
      connection.query(
        "DELETE FROM employee WHERE first_name = ? AND last_name = ?",
        [firstAndLast[0], firstAndLast[1]]
      );
      init();
    }
  );
}
//////////////////////////////////////////////////////////////////////////////////////////////
//Edit role

async function editRole() {
  const { role } = await inquirer.prompt({
    name: "role",
    type: "list",
    message: "What would you like to do?",
    choices: ["Add Role", "Update Role", "Exit"],
  });
  if (role === "Add Role") {
    addRole();
  } else if (role === "Update Role") {
    updateRole();
  } else {
    init();
  }
};
//////////////////////////////////////////////
////add role function
async function addRole() {
  const departments = await connection.query(
    "SELECT dept, id FROM department",
  )
  console.log(departments);
  const { dept, title, salary } = await inquirer.prompt([
    {
      name: "dept",
      type: "list",
      message: "Which departments will this role be associated with?",
      choices: departments.map((row) => ({ name: row.dept, value: row.id })),
    },
    {
      name: "title",
      type: "input",
      message: "What role are you creating?",
    },
    {
      name: "salary",
      type: "number",
      message: "What is the salary for this role?",
    },
  ])
  connection.query(`INSERT INTO role (title, salary, dept_id) VALUES ('${title}', ${salary}, ${dept})`,

    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " Role Added\n");
      init();
    });
};

///////////////////////////////////////////////////////////////////////////////////////////
//Edit role

async function updateRole() {
  const employees = await connection.query(
    "SELECT first_name AS firstName, last_name AS lastName, id FROM employee")
  const roles = await connection.query(
    "SELECT id, title, salary FROM role",
  )
  const { employee, role } = await inquirer.prompt([
    {
      name: "employee",
      type: "list",
      message: "Select an employee to update:",
      choices: employees.map((employee) => ({
        name: employee.firstName + " " + employee.lastName, value: employee.id
      })),
    },
    {
      name: "role",
      type: "list",
      message: "Select the new role:",
      choices: roles.map((row) => ({ name: row.title, value: row.id })),
    },
  ])
  connection.query(`UPDATE employee SET role_id = ${role} WHERE  id = ${employee}`,

    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " Role Added\n");
      init();
    });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// View function

async function viewInfo() {
  const { letsGo } = await inquirer.prompt({
    name: 'letsGo',
    type: 'list',
    message: 'Select a topic',
    choices: ['Employees', 'Departments', 'Roles']
  });
  let query;
  if (letsGo === 'Employees') {
    query = `SELECT  employee.first_name, employee.last_name,
      role.title, role.salary, department.dept AS department
      FROM ((employee
      INNER JOIN role ON employee.role_id = role.id)
      INNER JOIN department ON role.dept_id = department.id)
      ORDER BY department`;
  } else if (letsGo === 'Departments') {
    query = `SELECT dept FROM department`;
  } else if (letsGo === 'Roles') {
    query = `SELECT role.title, role.dept_id AS id, department.dept AS department FROM role 
    INNER JOIN department ON role.dept_id = department.id ORDER BY title ASC`;
  }
  const data = await connection.query(query);
  console.table(data);
  init();
}