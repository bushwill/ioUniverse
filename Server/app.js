const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');
app.use(cors());

let db;
let dbInit = false;

// Serve static files
app.use(express.static(path.join(__dirname, '../client')));

// Middleware to parse JSON requests
app.use(express.json());

// Function to initialize the database
function initializeDatabase(callback) {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  db.connect((err) => {
    if (err) {
      console.error('Database connection failed during initialization:', err);
      return callback(false); // Initialization failed
    }

    // Create the database if it doesn't exist
    db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err) => {
      if (err) {
        console.error('Error creating database:', err);
        db.end();
        return callback(false);
      }

      console.log(`Database ${process.env.DB_NAME} initialized successfully.`);
      return callback(true);
    });
  });
}

function createTables(callback) {
  db.connect((err) => {
    if (err) {
      console.error('Database connection failed during initialization:', err);
      return callback(false); // Initialization failed
    }

    // Create the players table if it doesn't exist
    db.query(`CREATE TABLE IF NOT EXISTS players
      ( username varchar(100) NOT NULL,
      x int unsigned NOT NULL,
      y int unsigned NOT NULL,
      r int unsigned NOT NULL,
      g int unsigned NOT NULL,
      b int unsigned NOT NULL,
      PRIMARY KEY (username)
      )`, (err) => {
      if (err) {
        console.error('Error creating players table:', err);
        return callback(false);
      }

      console.log(`Table players created successfully.`);
      return callback(true);
    });
  });
}

app.post('/initDB', (req, res) => {
  initializeDatabase((dbstatus) => {
    if (dbstatus) {
      createTables((tstatus) => {
        if (tstatus) {
          res.json({ status: true, message: 'Database initialized successfully.' });
          dbInit = true;
        }
        else {
          res.json({ status: false, message: 'Failed to initialize the players table.' });
        }
      });
    } else {
      res.json({ status: false, message: 'Failed to initialize the database.' });
      dbInit = false;
    }
  });
});

app.post('/sendPlayerData', (req, res) => {
  const { username, x, y, r, g, b } = req.body;

  const columns = ['x', 'y', 'r', 'g', 'b'];
  const updateClause = columns.map(col => `${col} = VALUES(${col})`).join(', ');

  const insertQuery = `
    INSERT INTO players (username, x, y, r, g, b)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE ${updateClause};`;

  db.query(insertQuery, [username, x, y, r, g, b], function (error, result) {
    if (error) {
      console.error("~~~~~~~~~~Error updating player information:\n", error);
      res.status(500).json({ success: false, message: "Error updating player information." });
    } else {
      res.status(200).json({ success: true, message: "Successfully updated player information!" });
    }
  });
});

app.get('/getPlayerData', (req, res) => {
  const query = 'SELECT * FROM players';
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error fetching players' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Listen on specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Serve app.html on the root route
app.get('/', (req, res) => {
  res.sendFile('app.html', { root: __dirname });
});

// Close DB connection when docker container sends shutdown signal
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down...');
  if (db) {
    db.end(() => {
      console.log('Database connection closed.');
    });
  } else {
    console.log('Database connection was not initialized.');
  }
});
