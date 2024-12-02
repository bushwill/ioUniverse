const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../client/index.html')));

const db = mysql.createConnection({
  host: process.env.DB_HOST,      
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database.');
});

// Example API endpoint
app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM your_table', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});