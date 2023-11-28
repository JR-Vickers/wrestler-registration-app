const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wrestling_tournament',
  password: 'password',
  port: 5432,
});

module.exports = pool;