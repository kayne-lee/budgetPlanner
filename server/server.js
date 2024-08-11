const express = require("express")
const cors = require("cors")
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express()

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

//middleware
app.use(express.json())
app.use(cors())

const supabase = require('./supabase');

app.post("/logout", async (req, res) => {
    const { accessToken } = req.body; // Make sure to pass the access token in the request

    const { error } = await supabase.auth.signOut(accessToken);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Logout successful" });
});


// Update the login route to use signInWithPassword
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({
        message: "Login successful",
        userId: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata.username, // Assuming you store the username in user_metadata
    });
});


app.post("/adduser", async (req, res) => {
    const { email, username, password } = req.body;

    const { user, error } = await supabase.auth.signUp({
        email,
        password,
        data: { username }, // Store the username in user metadata
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    console.log(user)
    res.status(201).json({ message: "User created successfully", user });
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

app.post("/addTransaction", async (req, res) => {
    const { data, error } = await supabase
        .from('user_transactions')
        .insert([req.body]);
    if (error) {
        console.error(error)
    } else  {
        res.json(data)
    }
})


app.get("/getIncomeData", async (req, res) => {
  const { month, year, user_id } = req.query;
    try {
        const { data, error } = await supabase
            .rpc('get_income_data', { user_id: user_id, month: parseInt(month), year: parseInt(year) })
    
        if (error) {
            throw error;
        }

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/getSpendingsData", async (req, res) => {
    const { month, year, user_id } = req.query;
    try {
        const { data, error } = await supabase
            .rpc('get_spendings_data', { user_id: user_id, month: parseInt(month), year: parseInt(year) })
    
        if (error) {
            throw error;
        }

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/getSavingsData", async (req, res) => {
  const { month, year, user_id } = req.query;

  try {
    const { data, error } = await supabase
        .rpc('get_savings_dataa', { user_id: user_id, month: parseInt(month), year: parseInt(year) });

    if (error) {
        throw error;
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.listen(4000, () => console.log("Server on localhost:4000"))