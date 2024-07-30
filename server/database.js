const { Pool } = require("pg")

const pool = new Pool({
    user: "postgres",
    password: "9621",
    host: "localhost",
    port: 5432,
    database: "budgetplanner"
    
})
// code to add a new table to the database
// CREATE TABLE IF NOT EXISTS users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(50) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL
// );
// const adjust = `
//     ALTER TABLE users
// ADD COLUMN email VARCHAR(100) UNIQUE NOT NULL;
// `;

// pool
//     .query(adjust)
//     .then((Response) => {
//     console.log("adjusted")
//     console.log(Response)
// })
// .catch((err) => {
//     console.log(err);
// })

module.exports = pool;