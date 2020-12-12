const inquirer = require("inquirer");
const connection = require("./connection");
const { init } = require("../../app")

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
        add();
    }
    if (department === "Remove Department") {
        remove();
    }
    if (department === "Exit") {
        init();
    }
};

async function add() {
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
        });
    init();
}
async function remove() {
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
module.exports = editDepartments, add, remove 