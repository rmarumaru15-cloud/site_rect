const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create tables if not exist
db.serialize(() => {
  console.log('Creating tables...');
  db.run(`CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    short_bio TEXT,
    long_bio TEXT,
    avatar TEXT,
    sns_youtube TEXT,
    sns_twitter TEXT,
    sns_instagram TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating profiles table:', err);
    } else {
      console.log('Profiles table created or already exists.');
    }
  });
  // Create portfolios table
  db.run(`CREATE TABLE IF NOT EXISTS portfolios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL,
    asset_name TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT,
    FOREIGN KEY (profile_id) REFERENCES profiles (id)
  )`, (err) => {
    if (err) {
      console.error('Error creating portfolios table:', err);
    } else {
      console.log('Portfolios table created or already exists.');
    }
  });
  // Create voice_commands table
  db.run(`CREATE TABLE IF NOT EXISTS voice_commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    command TEXT NOT NULL,
    result TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating voice_commands table:', err);
    } else {
      console.log('Voice_commands table created or already exists.');
    }
  });
});

// ここから下はdb.serialize()の外

// uploadsディレクトリ作成
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Routes
app.get('/profiles/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM profiles WHERE id = ?', [id], (err, profile) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
    } else {
      db.all('SELECT * FROM portfolios WHERE profile_id = ?', [id], (err, portfolios) => {
        if (err) {
          res.status(500).json({ error: 'Database error' });
        } else {
          res.json({ profile, portfolios });
        }
      });
    }
  });
});

app.post('/portfolios', (req, res) => {
  const { profile_id, asset_name, amount, category } = req.body;
  db.run(
    'INSERT INTO portfolios (profile_id, asset_name, amount, category) VALUES (?, ?, ?, ?)',
    [profile_id, asset_name, amount, category],
    function (err) {
      if (err) {
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
});

// 音声コマンドAPIエンドポイントの追加
app.post('/voice-command', (req, res) => {
  const { command } = req.body;
  // コマンドに応じた処理例
  if (!command) {
    return res.status(400).json({ error: 'No command provided' });
  }

  // 例: コマンドに応じてレスポンスを返す
  let response = '';
  switch (command.toLowerCase()) {
    case 'hello':
      response = 'こんにちは！ご用件は何ですか？';
      break;
    case 'profile':
      response = 'プロフィール情報を表示します。';
      break;
    // 他のコマンドもここに追加可能
    default:
      response = `コマンド「${command}」は認識できませんでした。`;
  }
  // コマンド履歴をDBに保存
  db.run(
    'INSERT INTO voice_commands (command, result) VALUES (?, ?)',
    [command, response],
    (err) => {
      if (err) {
        // エラーが発生しても、ユーザーへのレスポンスは返す
        console.error('Error inserting voice command:', err.message);
      }
    }
  );
  res.json({ result: response });
});

// 音声アップロードAPI
app.post('/voice-upload', (req, res) => {
  const { name, audioBase64 } = req.body;
  if (!name || !audioBase64) {
    return res.status(400).json({ error: 'nameとaudioBase64が必要です' });
  }
  const filePath = path.join(uploadDir, `${name}.wav`);
  const audioBuffer = Buffer.from(audioBase64, 'base64');
  fs.writeFile(filePath, audioBuffer, (err) => {
    if (err) {
      return res.status(500).json({ error: 'ファイル保存エラー' });
    }
    res.json({ success: true, file: `/voice-audio/${name}.wav` });
  });
});

// 音声ファイル取得API
app.get('/voice-audio/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'ファイルがありません' });
  }
  res.sendFile(filePath);
});

// 保存済み音声一覧API
app.get('/voice-list', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'ディレクトリエラー' });
    }
    res.json(files.filter(f => f.endsWith('.wav')));
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
