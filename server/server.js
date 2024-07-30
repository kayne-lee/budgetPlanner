const express = require("express")
const cors = require("cors")
const pool = require("./database")

const app = express()

//middleware
app.use(express.json())
app.use(cors())

app.post("/login", async (req, res) => {
    const email = req.body["email"]
    const password = req.body["password"]

    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2;", [email, password]);
        if (result.rows.length > 0) {
            // Successful login
            res.json({ message: "Login successful" });
        } else {
            // Incorrect credentials
            res.status(400).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        console.log(error)
    }
})
app.post("/adduser", async (req, res) => {
    const email = req.body["email"]
    const username = req.body["username"]
    const password = req.body["password"]

    const emailCheckQuery = `SELECT * FROM users WHERE email = $1;`;
    const insertSTMT = `INSERT INTO users ( username, password, email ) VALUES ( '${username}', '${password}', '${email}') RETURNING *;`;

    try {
        // Check if email already exists
        const emailCheck = await pool.query(emailCheckQuery, [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Insert new user
        const newUser = await pool.query(insertSTMT);
        return res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

app.listen(4000, () => console.log("Server on localhost:4000"))