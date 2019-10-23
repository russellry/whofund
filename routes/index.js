const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
var app = express();
app.set("view engine", "ejs");

function getDateNow() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  var today = yyyy + "-" + mm + "-" + dd;
  return today;
}

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgres://postgres:Pokemon2424!!@localhost:5432/whofund"
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
//DATABASE: User sign up form
app.post("/", (req, res, next) => {
  var email = req.body.signUpEmail;
  var username = req.body.signUpUsername;
  var password = req.body.signUpPassword;
  var queryString =
    "INSERT INTO users (email, username, password, joineddate) VALUES(";
  var todayDate = getDateNow();
  queryString +=
    "'" +
    email +
    "', '" +
    username +
    "', '" +
    password +
    "', '" +
    todayDate +
    "')";
  pool.query(queryString, err => {
    if (err) {
      res.redirect("/error/exists");
    } else {
      console.log("new user created");
      res.redirect("/home");
    }
    res.end();
  });
});

//DATEBASE: Project sign up form
app.post("/project/list", (req, res, next) => {
  var projTitle = req.body.projectTitle;
  var projDesc = req.body.projectDesc;
  var projTargetAmt = req.body.projectTargetAmt;
  var projDeadline = req.body.projectDeadline;
  var queryString =
    "INSERT INTO projects (projtitle, datecreated, description, targetamount, deadline) VALUES(";
  var projDateCreated = getDateNow();
  queryString +=
    "'" +
    projTitle +
    "', '" +
    projDateCreated +
    "', '" +
    projDesc +
    "', '" +
    projTargetAmt +
    "', '" +
    projDeadline +
    "')";
  pool.query(queryString, err => {
    if (err) {
      res.redirect("/error/projectexists");
    } else {
      console.log("new project created");
      res.redirect(`/project/list`);
    }
    res.end();
  });
});

//signup login
app.get("/home", (request, response) => response.render("home"));
app.get("/signup", (req, res) => res.render("signup"));
app.get("/", (request, response) => response.render("login"));

//project pages
app.get("/project/new", (request, response) => response.render("project-new"));
app.get("/project/list", (request, response) => {
  var queryString = "Select * from projects";
  pool.query(queryString, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      document.getElementById("project-list-data").innerHTML = data.rows;
      console.log("got all of the projects");
    }
  });
});

//error
app.get("/error/exists", (request, response) => response.render("errorexists"));

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
