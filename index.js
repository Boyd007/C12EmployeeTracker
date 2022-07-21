const express = require("express");

const mysql = require("mysql2");

const inquirer = require("inquirer");

const cTable = require("console.table");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "abcd1234",
    database: "business_db",
  },
  console.log(`Connected to the business_db database.`)
);

startQuestions = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "initial_questions",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Exit",
        ],
      },
    ])
    .then((response) => {
      switch (response.initial_questions) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          break;
        case "Update an employee role":
          addUpdateEmployeeRole();
          break;
        case "Exit":
          process.exit();
      }
    });
};
function addUpdateEmployeeRole() {
  db.query(
    "SELECT employee.id AS Employee_ID, CONCAT(employee.first_name, " +
      "employee.last_name) AS Employee_Name, role.title AS Employee_Role, " +
      "role.salary AS Employee_Salary, CONCAT(e2.first_name, " +
      "e2.last_name) AS Employee_Manager FROM employee INNER JOIN role ON " +
      "employee.role_id = role.id LEFT JOIN employee as e2 ON e2.id = " +
      "employee.manager_id",
    (err, res) => {
      if (err) {
        throw err;
      } else {
        console.log(res);
        const employeeList = res.map((item) => ({
          name: item.Employee_Name,
          value: item.Employee_ID,
        }));
        console.log(employeeList);
        inquirer
          .prompt([
            {
              type: "list",
              message: "Which employee would you like to update?",
              name: "employee_id",
              choices: employeeList,
            },
          ])
          .then((response) => {
            console.log(response);
            db.query("select * from role", (err, res) => {
              if (err) {
                throw err;
              } else {
                const roleList = res.map((item) => ({
                  name: item.title,
                  value: item.id,
                  
                }));
                inquirer
                  .prompt([
                    {
                      type: "list",
                      message: "Which role would you like to assign?",
                      name: "role_id",
                      choices: roleList,
                    },
                  ])
              }
              
              startQuestions();
            });
          });
      }
    }
  );
}
function addRole() {
  db.query("SELECT * FROM department", (err, res) => {
    if (err) {
      throw err;
    } else {
      inquirer
        .prompt([
          {
            type: "input",
            message: "What would you like to call the new role?",
            name: "new_role",
          },
          {
            type: "input",
            message: "What is the salary for this role?",
            name: "new_salary",
          },
          {
            type: "list",
            message: "What department does this role belong to?",
            name: "new_department",
            choices: res.map((item) => item.name),
          },
        ])
        .then((input) => {
          db.query(
            "INSERT INTO role SET ?",
            {
              title: input.new_role,
              salary: input.new_salary,
              department_id: res.find(
                (item) => item.name === input.new_department
              ).id,
            },
            (err, res) => {
              if (err) throw err;
              startQuestions();
            }
          );
        });
    }
  });
}
function viewDepartments() {
  db.query(
    "SELECT department.id AS Department_ID, department.name AS Department_Name FROM department",
    (err, res) => {
      if (err) {
        throw err;
      } else {
        console.table(res);
      }
      startQuestions();
    }
  );
}

function viewRoles() {
  db.query(
    "SELECT role.id AS Role_ID, role.title AS Role_Title, role.salary AS Role_Salary, department.name AS Role_Department_ID FROM role INNER JOIN department ON role.department_id = department.id;",
    (err, res) => {
      if (err) {
        throw err;
      } else {
        console.table(res);
      }
      startQuestions();
    }
  );
}

function viewEmployees() {
  db.query(
    'SELECT employee.id AS Employee_ID, CONCAT(employee.first_name, " ", employee.last_name) AS Employee_Name, role.title AS Employee_Role, role.salary AS Employee_Salary, CONCAT(e2.first_name, " ", e2.last_name) AS Employee_Manager FROM employee INNER JOIN role ON employee.role_id = role.id LEFT JOIN employee as e2 ON e2.id = employee.manager_id',
    (err, res) => {
      if (err) {
        throw err;
      } else {
        console.table(res);
      }
      startQuestions();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What would you like to call the new department?",
        name: "new_department",
      },
    ])
    .then((input) => {
      db.query(
        "INSERT INTO department SET ?",
        { name: input.new_department },
        (err, res) => {
          if (err) throw err;
          startQuestions();
        }
      );
    });
}

startQuestions();
