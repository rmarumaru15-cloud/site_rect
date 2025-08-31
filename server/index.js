require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-for-session', // Fallback secret
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Database setup
const dbPath = './database.sqlite';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run('PRAGMA foreign_keys = ON;', (err) => {
      if (err) console.error("Could not enable foreign keys:", err.message);
    });
    initializeDb();
  }
});

function initializeDb() {
  db.serialize(() => {
    console.log('Initializing database schema...');

    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      google_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      picture TEXT
    )`);

    // Profiles table (simplified for now)
    db.run(`CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      bio TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )`);

    // Portfolios table
    db.run(`CREATE TABLE IF NOT EXISTS portfolios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      asset_name TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT,
      acquisition_date DATE,
      acquisition_price REAL,
      location TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )`);

    // Voice commands table
    db.run(`CREATE TABLE IF NOT EXISTS voice_commands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      command TEXT NOT NULL,
      result TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });
}

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized: Not logged in' });
    }
};

// --- Authentication Routes ---
app.post('/api/auth/google', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: google_id, name, email, picture } = payload;

        db.get('SELECT * FROM users WHERE google_id = ?', [google_id], (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error during user lookup' });
            }

            if (user) {
                // User exists, create session
                req.session.user = { id: user.id, name: user.name, email: user.email, picture: user.picture };
                res.status(200).json(req.session.user);
            } else {
                // New user
                const insertUser = 'INSERT INTO users (google_id, name, email, avatar_url) VALUES (?, ?, ?, ?)';
                db.run(insertUser, [google_id, name, email, picture], function(err) {
                    if (err) {
                        return res.status(500).json({ error: 'Database error on user creation' });
                    }
                    const newUserId = this.lastID;
                    req.session.user = { id: newUserId, name, email, avatar: picture };
                    res.status(201).json(req.session.user);
                });
            }
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        } else {
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Logged out successfully' });
        }
    });
});

app.get('/api/me', (req, res) => {
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});


// --- Portfolio Routes (Now protected) ---
app.get('/api/portfolio', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;
    const sql = `
        SELECT
            p.id, p.asset_name, p.amount, p.category, p.acquisition_date, p.acquisition_price, p.location,
            u.name as userName,
            pr.bio, pr.is_public, pr.sns_youtube, pr.sns_twitter, pr.wallet_eth, pr.wallet_bnb
        FROM users u
        LEFT JOIN profiles pr ON u.id = pr.user_id
        LEFT JOIN portfolios p ON u.id = p.user_id
        WHERE u.id = ?
    `;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching portfolio data:', err.message);
            res.status(500).json({ error: 'Database error' });
            return;
        }

        if (rows.length > 0) {
            const profile = {
                name: rows[0].userName,
                bio: rows[0].bio,
                is_public: rows[0].is_public,
                sns_youtube: rows[0].sns_youtube,
                sns_twitter: rows[0].sns_twitter,
                wallet_eth: rows[0].wallet_eth,
                wallet_bnb: rows[0].wallet_bnb
            };
            // If the first row's portfolio id is null, it means the user exists but has no portfolio items
            const portfolioItems = rows[0].id === null ? [] : rows.map(r => ({
                id: r.id,
                name: r.asset_name,
                amount: r.amount,
                category: r.category,
                acquisitionDate: r.acquisition_date,
                acquisitionPrice: r.acquisition_price,
                location: r.location
            }));
            res.json({ profile, portfolio: portfolioItems });
        } else {
            // This case might happen for a new user who doesn't have a profile entry yet,
            // though the signup logic tries to prevent this.
            // Let's fetch the user's name at least.
            db.get('SELECT name, avatar_url FROM users WHERE id = ?', [userId], (err, user) => {
                if (err) {
                    res.status(500).json({ error: 'Database error' });
                } else if (user) {
                    res.json({ profile: { name: user.name, avatar: user.avatar_url }, portfolio: [] });
                } else {
                    res.status(404).json({ error: 'User not found' });
                }
            });
        }
    });
});


app.post('/api/portfolios', isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  const { asset_name, amount, category, acquisition_date, acquisition_price, location } = req.body;

  if (!asset_name || amount == null || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  // Note: The table schema has changed. 'quantity' is now 'amount' and 'asset_type' is a new column.
  // The client-side might need an update to send `asset_type` and `asset_sector`.
  // For now, we'll use the available fields.
  const sql = `INSERT INTO portfolios (user_id, asset_name, amount, category, acquisition_date, acquisition_price, location) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [userId, asset_name, amount, category, acquisition_date, acquisition_price, location];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Database error on portfolio creation:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    // Return the newly created item
    db.get('SELECT * FROM portfolios WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Could not fetch the created portfolio item' });
        } else {
            res.status(201).json(row);
        }
    });
  });
});


// Unprotected routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Voice command routes (remain unprotected for now)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

app.post('/voice-command', (req, res) => {
  const { command } = req.body;
  if (!command) {
    return res.status(400).json({ error: 'No command provided' });
  }
  let response = '';
  switch (command.toLowerCase()) {
    case 'hello':
      response = 'こんにちは！ご用件は何ですか？';
      break;
    case 'profile':
      response = 'プロフィール情報を表示します。';
      break;
    default:
      response = `コマンド「${command}」は認識できませんでした。`;
  }
  db.run(
    'INSERT INTO voice_commands (command, result) VALUES (?, ?)',
    [command, response],
    (err) => {
      if (err) {
        console.error('Error inserting voice command:', err.message);
      }
    }
  );
  res.json({ result: response });
});

app.post('/voice-upload', (req, res) => {
  const { name, audioBase64 } = req.body;
  if (!name || !audioBase64) {
    return res.status(400).json({ error: 'nameとaudioBase64が必要です' });
  }
  const filePath = path.join(uploadsDir, `${name}.wav`);
  const audioBuffer = Buffer.from(audioBase64, 'base64');
  fs.writeFile(filePath, audioBuffer, (err) => {
    if (err) {
      return res.status(500).json({ error: 'ファイル保存エラー' });
    }
    res.json({ success: true, file: `/voice-audio/${name}.wav` });
  });
});

app.get('/voice-audio/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'ファイルがありません' });
  }
  res.sendFile(filePath);
});

app.get('/voice-list', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'ディレクトリエラー' });
    }
    res.json(files.filter(f => f.endsWith('.wav')));
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
