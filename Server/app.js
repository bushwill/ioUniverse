const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');
const { create } = require('domain');
app.use(cors());

let db;
let dbInit = false;
let circles = []; // Store players

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

    // Create the circles table if it doesn't exist
    db.query(`CREATE TABLE IF NOT EXISTS circles
      ( id int unsigned NOT NULL auto_increment, 
      username varchar(100) NOT NULL,
      x int unsigned NOT NULL,
      y int unsigned NOT NULL,
      PRIMARY KEY (id)
      )`, (err) => {
      if (err) {
        console.error('Error creating circles table:', err);
        db.end();
        return callback(false);
      }

      console.log(`Table circles created successfully.`);
      return callback(true);
    });
  });
}

app.post('/initDB', (req, res) => {
  if (!dbInit) {
    initializeDatabase((dbstatus) => {
      if (dbstatus) {
        createTables((tstatus) => {
          if (tstatus) {
            res.json({ status: true, message: 'Database initialized successfully.' });
            dbInit = true;
          }
          else {
            res.json({ status: false, message: 'Failed to initialize the circles table.' });
          }
        });
      } else {
        res.json({ status: false, message: 'Failed to initialize the database.' });
        dbInit = false;
      }
    });
  } else res.json({ status: true, message: 'Database already initialized' });
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
