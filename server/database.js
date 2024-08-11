const { Pool } = require("pg")

const pool = new Pool({
    user: "postgres",
    password: "9621",
    host: "localhost",
    port: 5432,
    database: "budgetplanner"
    
})

module.exports = pool;