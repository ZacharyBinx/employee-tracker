const connection = require("./assets/js/connection");
const inquirer = require("inquirer");
const questions = require("./assets/js/questions");
const { deepStrictEqual } = require("assert");

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
    case "View All Employees":
      viewEmployees();
      break;
    case "Search Employees By Manager":
      employeeByManager();
      break;
    case "Update Employee Managers":
      updateManager();
      break;
    case "Total Budget By Department":
      departmentBudget();
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
  switch (add.roleID) {
    case "Intern":
      add.roleID = 1;
      break;
    case "IT":
      add.roleID = 2;
      break;
    case "Janitor":
      add.roleID = 3;
      break;
  }
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


// const departmentName = await inquirer.prompt({
//   name: "department",
//   type: "list",
//   message: "What department are you removing",
//   choices: deepStrictEqual.map((dept) => ({

//   }))
// });

//   const data = departmentName.department

//   const query = await connection.query(
//     "INSERT INTO department SET ?",
//     {
//       dept: data,
//     },

//     function (err, res) {
//       if (err) throw err;
//       console.log(res.affectedRows + " Department Added\n");
//       init();
//     });
// }




// const query = "SELECT position, song, year FROM top5000 WHERE ?";
// // SELECT position, song, year FROM top5000 WHERE artist = "Led Zeppelin"
// const data = await connection.query(query, { artist });
// console.table(data);
// init();



// * A query which returns all artists who appear within the top 5000 more than once
async function multiSearch() {
  const query =
    "SELECT artist, count(*) AS count FROM top5000 GROUP BY artist HAVING count(*) > 1 ORDER BY count DESC";
  const data = await connection.query(query);
  console.table(data);
  init();
}
// * A query which returns all data contained within a specific range
async function rangeSearch() {
  const { start, end } = await inquirer.prompt([
    {
      name: "start",
      type: "input",
      message: "Enter starting position: ",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      },
    },
    {
      name: "end",
      type: "input",
      message: "Enter ending position: ",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      },
    },
  ]);

  const query = `SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ${connection.escape(
    start
  )} AND ${connection.escape(end)}`;
  const data = await connection.query(query);
  console.table(data);
  init();
}

// * A query which searches for a specific song in the top 5000 and returns the data for it
async function specificSong() {
  const { song } = await inquirer.prompt({
    name: "song",
    type: "input",
    message: "What song would you like to look for?",
  });
  const data = await connection.query("SELECT * FROM top5000 WHERE ?", {
    song,
  });
  console.table(data);
  init();
}
