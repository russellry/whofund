const express = require("express");
const bodyParser = require("body-parser");
const port = 5432;
var app = express();
app.set("view engine", "ejs");

// static files
app.use('/', express.static('images'));
app.use('/', express.static('javascripts'));
app.use('/', express.static('stylesheets'));

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
const connectionString = 
  "postgres://postgres:cs2102haha@localhost:5433/postgres"

const pool = new Pool({
  connectionString: connectionString
  // connectionString:
  //   "postgres://postgres:cs2102haha@localhost:3000/postgres"
  // connectionString: "postgres://postgres:Pokemon2424!!@localhost:5432/whofund"
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
//DATABASE: User sign up form
app.post("/user-signup", async (req, res, next) => {
  var username = req.body.signUpUsername;
  try {
    const hashedPassword = await bcrypt.hash(req.body.signUpPassword, 10)
    // var password = req.body.signUpPassword;
    var queryString =
      "INSERT INTO users (username, password, joineddate) VALUES(";
    var todayDate = getDateNow();
    queryString += "'" + username + "', '" + hashedPassword + "', '" + todayDate + "')";
    pool.query(queryString, err => {

      if (err) {
       res.redirect("/error/userexists");
      } else {
        console.log("new user created");
        res.redirect("/home");
      }
      // res.end();
    });
  } catch {
    res.redirect("/error/userexists");
  }
});

// user exists error page
app.get("/error/userexists", (req,res) => {
  res.render("user-exists");
});

//DATEBASE: Project sign up form
app.post("/project-signup", (req, res, next) => {
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
      res.redirect(`/projects`);
    }
    res.end();
  });
});

// project exists error page
app.get("/error/projectexists", (res,req) => {
  res.render("project-exists");
});

//signup login
app.get("/login", (req, res) => {
  // var userInfo = "Select * from users where..."; //TODO: edit later...
  // var username = req.body.username;
  // var password = req.body.password;
  
  // res.render("home");
  res.render("login.ejs");
});
app.get("/signup", (req, res) => res.render("user-signup"));
app.get("/", (request, response) => response.render("home"));

// app.post("/login", passport.authenticate('local', {
//   successRedirect: '/home',
//   failureRedirect: '/login',
//   failureFlash: true
// }))

// user pages
app.get("/users", async (req, res) => {
  const rows = await readUsers();
  res.render("users", {data: rows});
});

app.get("/profile/:username", async (req,res) => {
  const row = await getUserInfo(req.params.username);
  // await getUserInfo(req.params.username);
  res.render("profile", {data: row});
});

// user page functions
async function readUsers() {
  try {
    const results = await pool.query("select * from users");
    return results.rows;
  } catch (e) {
    return [];
  }
}

async function getUserInfo(username) {
  try {
    var queryString = "select * from users where username = '" + username + "'";
    const results = await pool.query(queryString);
    return results.rows;
  } catch (e) {
    return [];
  }
}

//project pages
app.get("/project/new", (req, res) => res.render("project-signup"));

app.get("/projects", async (req, res) => {
  const rows = await readProjects();
  res.render("projects", {data: rows});
  // var queryString = "Select * from projects";
  // pool.query(queryString, (err, data) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     document.getElementById("project-list-data").innerHTML = data.rows;
  //     console.log("got all of the projects");
  //   }
  // });
});

app.get("/project/:projtitle", async (req, res) => {
  const row = await getProjectInfo(req.params.projtitle);
  res.render("project-detail", {data: row});
});

// project page functions
async function readProjects() {
  try {
    const results = await pool.query("select * from projects");
    return results.rows;
  } catch (e) {
    return [];
  }
}

async function getProjectInfo(projTitle) {
  try {
    var queryString = "select * from projects where projtitle = '" + projTitle + "'";
    const results = await pool.query(queryString);
    return results.rows;
  } catch (e) {
    return [];
  }
}

//error
app.get("/error/exists", (req, res) => res.render("errorexists"));

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});