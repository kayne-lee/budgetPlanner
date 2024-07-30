const express = require("express")
const cors = require("cors")
const pool = require("./database")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express()

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

//middleware
app.use(express.json())
app.use(cors())

app.post("/login", async (req, res) => {
    const email = req.body["email"];
    const password = req.body["password"];

    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const match = await bcrypt.compare(password, user.password); // Compare hashed passwords
            if (match) {
                const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
                res.json({ message: "Login successful", token, username: user.username });
            } else {
                res.status(400).json({ error: "Invalid email or password" });
            }
        } else {
            res.status(400).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
app.post("/adduser", async (req, res) => {
    const email = req.body["email"];
    const username = req.body["username"];
    const password = req.body["password"];
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const emailCheckQuery = `SELECT * FROM users WHERE email = $1;`;
    const insertSTMT = `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *;`;

    try {
        // Check if email already exists
        const emailCheck = await pool.query(emailCheckQuery, [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Insert new user
        const newUser = await pool.query(insertSTMT, [username, hashedPassword, email]);
        return res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(4000, () => console.log("Server on localhost:4000"))