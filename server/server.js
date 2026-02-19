const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_jwt_secret_key_here'; // In production, use .env

app.use(cors());
app.use(express.json());

// Register Endpoint
app.post('/register', async (req, res) => {
    const { username, name, password, email, phone } = req.body;

    if (!username || !name || !password || !email || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if user exists
        const [existingUsers] = await db.execute(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'User with this email or username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await db.execute(
            'INSERT INTO users (username, name, password, email, phone) VALUES (?, ?, ?, ?, ?)',
            [username, name, hashedPassword, email, phone]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
