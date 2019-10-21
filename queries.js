const Pool = require("pg").Pool;
var config = require("./config.json");

const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port
});

module.exports = {};
