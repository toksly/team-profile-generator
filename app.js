const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const http = require("http");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");
const express = require("express");
const app = express();
const employees = [];

//Code to use inquirer to gather information about the development team members,
async function askquestions() {
  const res = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the employee's name?"
    },
    {
      type: "input",
      name: "id",
      message: "What is the employee's id?"
    },
    {
      type: "input",
      name: "email",
      message: "What is the employee's email address?"
    },
    {
      type: "list",
      name: "role",
      message: "Select the employee's role?",
      choices: ["Manager", "Engineer", "Intern"]
    }
  ]);
  //create objects for each team member (using the correct classes as blueprints!)
  //code to ask different questions via inquirer depending on
  // employee type.
  switch (res.role) {
    case "Manager":
      const phone = await inquirer.prompt([
        {
          type: "input",
          name: "officeNumber",
          message: "What the manager's office number?"
        }
      ]);
      employees.push(
        new Manager(res.name, res.id, res.email, phone.officeNumber)
      );
      addAnotherEmployee();
      break;
    case "Engineer":
      const gitHub = await inquirer.prompt([
        {
          type: "input",
          name: "gitHubUserName",
          message: "What the engineer's github username?"
        }
      ]);
      employees.push(
        new Engineer(res.name, res.id, res.email, gitHub.gitHubUserName)
      );
      addAnotherEmployee();
      break;
    case "Intern":
      const school = await inquirer.prompt([
        {
          type: "input",
          name: "schoolName",
          message: "Which school does the intern go to?"
        }
      ]);
      employees.push(
        new Intern(res.name, res.id, res.email, school.schoolName)
      );
      addAnotherEmployee();
      break;
    default:
  }
}
askquestions();

async function addAnotherEmployee() {
  const addMoreEmployee = await inquirer.prompt([
    {
      type: "confirm",
      name: "addAgain",
      message: "Do you want to add another employee?"
    }
  ]);
  addMoreEmployee.addAgain == true ? askquestions() : buildTeam(employees);
}

//render ( employees)
function buildTeam(employees) {
  // Create the output directory if the output path doesn’t exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  fs.writeFileSync(outputPath, render(employees), "utf-8");
}

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!
// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!```