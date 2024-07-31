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
                res.json({ message: "Login successful", token, username: user.username, userId: user.userId });
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

app.post("/addTransaction", authenticateToken, async (req, res) => {
    const { category, type, amount, transaction_date, description } = req.body;
    const userId = req.user.userId;

    try {
        await pool.query(
            "INSERT INTO user_transactions (user_id, category, type, amount, transaction_date, description) VALUES ($1, $2, $3, $4, $5, $6);",
            [userId, category, type, amount, transaction_date, description]
        );
        res.status(201).json({ message: "Transaction added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/getIncomeData", authenticateToken, async (req, res) => {
    const userId = req.user.userId; // Assuming userId is stored in the token

    try {
        const query = `
            SELECT type, SUM(amount) as total_amount
            FROM user_transactions
            WHERE user_id = $1 AND category = 'Income'
            GROUP BY type
        `;
        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Endpoint to get spendings data
app.get("/getSpendingsData", authenticateToken, async (req, res) => {
    const userId = req.user.userId; // Assuming userId is stored in the token
    try {
      const result = await pool.query(
        "SELECT type, SUM(amount) AS total_amount FROM user_transactions WHERE category = 'Spendings' AND user_id = $1 GROUP BY type",
        [userId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/getSavingsData", authenticateToken, async (req, res) => {
    const userId = req.user.userId; // Assuming userId is stored in the token
    try {
      const result = await pool.query(
        "SELECT type, SUM(amount) AS total_amount FROM user_transactions WHERE category = 'Savings' AND user_id = $1 GROUP BY type",
        [userId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get('/getMonthlyData', async (req, res) => {
    try {
      // Decode the token to get the user ID (assuming you use JWT)
      const userId = req.user.userId;
  
      const result = await pool.query(`
        SELECT
          DATE_TRUNC('month', transaction_date) AS month,
          category,
          SUM(amount) AS total_amount
        FROM transactions
        WHERE user_id = $1 AND transaction_date >= NOW() - INTERVAL '12 months'
        GROUP BY month, category
        ORDER BY month DESC
      `, [userId]);
  
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });


app.listen(4000, () => console.log("Server on localhost:4000"))