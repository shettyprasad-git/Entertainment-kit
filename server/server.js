const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here'; // In production, use .env

app.use(cors());
app.use(express.json());

// Initialize Database Tables
const initDB = async () => {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS profiles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                color VARCHAR(50) DEFAULT 'bg-blue-600',
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        await db.execute(`
            CREATE TABLE IF NOT EXISTS my_list (
                id INT AUTO_INCREMENT PRIMARY KEY,
                profile_id INT NOT NULL,
                movie_id INT NOT NULL,
                movie_data JSON NOT NULL,
                UNIQUE KEY unique_movie_profile (profile_id, movie_id),
                FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
            )
        `);
        console.log("Database tables initialized.");
    } catch (err) {
        console.error("Error initializing tables:", err);
    }
};

initDB();

// Middleware to verify JWT
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Register Endpoint
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    let username = email.split('@')[0];
    const phone = req.body.phone || '';

    if (!name || !password || !email) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    try {
        const [existingUsers] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        // Ensure username is unique to prevent ER_DUP_ENTRY MySQL crashes
        const [existingUsernames] = await db.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        
        if (existingUsernames.length > 0) {
            username = `${username}${Math.floor(Math.random() * 10000)}`;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [userResult] = await db.execute(
            'INSERT INTO users (username, name, password, email, phone) VALUES (?, ?, ?, ?, ?)',
            [username, name, hashedPassword, email, phone]
        );
        
        const userId = userResult.insertId;

        // Auto-create the first profile using their name
        const colors = ["bg-red-600", "bg-blue-600", "bg-green-500", "bg-yellow-500", "bg-purple-600", "bg-pink-600", "bg-indigo-600"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        await db.execute(
            'INSERT INTO profiles (user_id, name, color) VALUES (?, ?, ?)',
            [userId, name, randomColor]
        );

        res.status(201).json({ message: 'User registered successfully with default profile' });
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
            expiresIn: '7d',
        });

        res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Profiles API
app.get('/profiles', auth, async (req, res) => {
    try {
        const [profiles] = await db.execute('SELECT * FROM profiles WHERE user_id = ?', [req.user.id]);
        res.json(profiles);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profiles' });
    }
});

app.post('/profiles', auth, async (req, res) => {
    const { name, color } = req.body;
    if (!name || !color) return res.status(400).json({ error: 'Name and color required' });

    try {
        const [result] = await db.execute(
            'INSERT INTO profiles (user_id, name, color) VALUES (?, ?, ?)',
            [req.user.id, name, color]
        );
        res.json({ id: result.insertId, name, color, user_id: req.user.id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create profile' });
    }
});

app.put('/profiles/:id', auth, async (req, res) => {
    const { name, color } = req.body;
    const profileId = req.params.id;

    try {
        await db.execute(
            'UPDATE profiles SET name = ?, color = ? WHERE id = ? AND user_id = ?',
            [name, color, profileId, req.user.id]
        );
        res.json({ id: parseInt(profileId), name, color, user_id: req.user.id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

app.delete('/profiles/:id', auth, async (req, res) => {
    const profileId = req.params.id;
    try {
        await db.execute('DELETE FROM profiles WHERE id = ? AND user_id = ?', [profileId, req.user.id]);
        res.json({ message: 'Profile deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete profile' });
    }
});

// My List API (tied to profile)
app.get('/my-list/:profileId', auth, async (req, res) => {
    try {
        const [list] = await db.execute('SELECT * FROM my_list WHERE profile_id = ?', [req.params.profileId]);
        res.json(list.map(row => ({ id: row.id, movie_id: row.movie_id, data: row.movie_data })));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch my list' });
    }
});

app.post('/my-list', auth, async (req, res) => {
    const { profile_id, movie_id, movie_data } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO my_list (profile_id, movie_id, movie_data) VALUES (?, ?, ?)',
            [profile_id, movie_id, JSON.stringify(movie_data)]
        );
        res.json({ id: result.insertId, profile_id, movie_id, movie_data });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Movie already in list' });
        }
        res.status(500).json({ error: 'Failed to add to my list' });
    }
});

app.delete('/my-list/:profileId/:movieId', auth, async (req, res) => {
    try {
        await db.execute('DELETE FROM my_list WHERE profile_id = ? AND movie_id = ?', [req.params.profileId, req.params.movieId]);
        res.json({ message: 'Removed from my list' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove from my list' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
