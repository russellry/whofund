var express = require("express");
var router = express.Router();
var config = require("./config.json");

const { Pool } = require("pg");
const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port
});

function loggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

var all_users_query = "SELECT * FROM users";
var user_insert_query =
  "INSERT into users (email, username, password, joindate) VALUES";

// GET
router.get("/", isLoggedIn, function(req, res, next) {
  pool.query(sql_query, (err, data) => {
    if (err) {
      next(err);
    } else {
      res.render("admin", {
        title: "Admin Page",
        user: req.user,
        data: data.rows
      });
    }
  });
});

// POST (happens upon submit)
router.post("/", function(req, res, next) {
  // Retrieve Information
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var joindate = req.body.joindate;

  // Construct Specific SQL Query
  var insert_query =
    sql_insert +
    "('" +
    email +
    "','" +
    username +
    "','" +
    password +
    "','" +
    joindate +
    "');";
  pool.query(insert_query, (err, data) => {
    if (err) {
      next(err);
    } else {
      res.redirect("/admin");
    }
  });
});

module.exports = router;
