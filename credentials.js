const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "whofund",
  password: "Pokemon2424!!",
  port: 5432
});

module.exports = {
  pool
};
