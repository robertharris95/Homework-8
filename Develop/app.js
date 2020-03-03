const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");
let employees = [];
let choices = [];
var hasManager = false
var start = function(){
    if(hasManager == false){
    choices = [ "Manager", "Engineer", "Intern"]
    }
    else if(hasManager == true){
        choices = [ "Engineer", "Intern"]
    };
    console.log("----------------------------------------------------------")
    inquirer
        .prompt([
            {
                type: "list",
                message:"What is this employee's role?",
                name:"role",
                choices: choices
            },
            {
                message: "Please enter the Employee Name",
                name:"name",
                validate: function (input) {
                    if (input !== null || input !== undefined || input =="") {
                        // SOLUTION: Simple place the return outside from the function
                        return true;
                    }
                    return 'You need to type in a Name';
                }
            },
            {
                message: "Please enter the Employee Id",
                name:"id",
                validate: function (input) {
                    if (input !== null || input !== undefined || input =="") {
                        // SOLUTION: Simple place the return outside from the function
                        return true;
                    }
                    return 'You need to type in an Id';
                }
            },
            {
                message: "Please enter the Employee email",
                name:"email",
                validate: function (input) {
                    if (input.includes("@") == true && input.includes(".") == true) {
                        // SOLUTION: Simple place the return outside from the function
                        return true;
                    }
                    return 'You need to type in an Email';
                }
            },
        ]).then(function(response){
            if(response.role === "Manager"){
                //limits to 1 manager per team
                hasManager = true
                inquirer
                    .prompt(
                        {
                        type: "number",
                        message:"Enter the Manager Office Number",
                        name:"officeNumber",
                        validate: function (input) {
                            if (input !== null || input !== undefined || input =="") {
                                // SOLUTION: Simple place the return outside from the function
                                return true;
                            }
                            return 'You need to type in an Office Number';
                        }
                        }
                    ).then(function(resp){
                        var manager = new Manager(response.name,response.id, response.email, resp.officeNumber)
                        employees.push(manager);
                        inquirer.prompt({
                            type: "confirm",
                            message: "Add another employee?",
                            name:"again"
                        }).then(function(restart){
                            if(restart.again === true){
                                start();
                            }
                            else{
                                writer();
                                return false;
                            }
                        })
                    })
            }
            else if(response.role === "Engineer"){
                inquirer
                    .prompt(
                        {
                        message:"Enter the Engineer's Github username",
                        name:"github",
                        validate: function (input) {
                            if (input !== null || input !== undefined || input =="") {
                                // SOLUTION: Simple place the return outside from the function
                                return true;
                            }
                            return 'You need to type in a github username';
                        }
                        }
                    ).then(function(resp){
                        var engineer = new Engineer(response.name,response.id, response.email, resp.github)
                        employees.push(engineer);
                        inquirer.prompt({
                            type: "confirm",
                            message: "Add another employee?",
                            name:"again"
                        }).then(function(restart){
                            if(restart.again === true){
                                start();
                            }
                            else{
                                writer();
                                return false;
                            }
                        })
                    })
            }
            else if(response.role === "Intern"){
                inquirer
                    .prompt(
                        {
                        message:"Enter the Intern's School",
                        name:"school",
                        validate: function (input) {
                            if (input !== null || input !== undefined || input =="") {
                                // SOLUTION: Simple place the return outside from the function
                                return true;
                            }
                            return 'You need to type in a proper school';
                        }
                        }
                    ).then(function(resp){
                        var intern = new Intern(response.name,response.id, response.email, resp.school)
                        employees.push(intern);
                        inquirer.prompt({
                            type: "confirm",
                            message: "Add another employee?",
                            name:"again"
                        }).then(function(restart){
                            if(restart.again === true){
                                start();
                            }
                            else{
                                writer();
                                return false;
                            }
                        })
                    })
            }
        });
    }
var writer = function(){
fs.writeFile(outputPath, render(employees), function(err){
if (err) throw err;});}
start();
