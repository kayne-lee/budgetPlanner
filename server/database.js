const { Pool } = require("pg")

const pool = new Pool({
    user: "postgres",
    password: "9621",
    host: "localhost",
    port: 5432,
    database: "budgetplanner"
    
})
// code to add a new table to the database

// const adjust = `
// CREATE TABLE user_transactions (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES users(id),
//     category VARCHAR(50),
//     type VARCHAR(50),
//     amount DECIMAL(10, 2),
//     transaction_date DATE
// );
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