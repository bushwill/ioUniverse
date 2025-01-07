const WebSocket = require('ws');
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const INACTIVITY_THRESHOLD = 10 * 60 * 1000;

app.use(express.static(path.join(__dirname, '../client'), {
  setHeaders: (res, filePath) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
}));

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const wss = new WebSocket.Server({ server });

let players = [];
const playerSockets = new Map(); // Maps usernames to WebSocket instances
let currentUsername;

class Player {
  constructor(username, r, g, b, x, y) {
    this.username = username;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.r = r;
    this.g = g;
    this.b = b;
    this.messages = [];
    this.lastActivity = millis();
  }
}

const startMillis = Date.now();
function millis() {
  return Date.now() - startMillis;
}

function updatePlayerPositions() {
  const deltaTime = 0.01;
  players.forEach(player => {
    player.x += player.vx * deltaTime;
    player.y += player.vy * deltaTime;

    player.vx = player.vx * (1 - deltaTime);
    player.vy = player.vy * (1 - deltaTime)
  });
}

setInterval(updatePlayerPositions, 10);

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const message = JSON.parse(data);

    if (message.type === 'login') {
      const { username, r, g, b, x, y } = message;
      let found = false;
      players.forEach((player) => {
        if (player.username === username) {
          found = true;
        }
      });
      if (!found) {
        players.push(new Player(username, r, g, b, x, y));
        playerSockets.set(username, ws);
        console.log(`Player logged in: ${username}`);
        currentUsername = username;
        ws.send(JSON.stringify({ type: 'login_success', username }));
      } else {
        ws.send(JSON.stringify({ type: 'login_failed', message: `Username "${username}" is already in use.` }))
      }

    } else if (message.type === 'update') {
      const { username, keys, chat_message } = message;
      const player = players.find((p) => p.username === username);
      if (player) {
        let activity = false;
        if (keys.w) {player.vy -= 5; activity = true}
        if (keys.s) {player.vy += 5; activity = true}
        if (keys.a) {player.vx -= 5; activity = true}
        if (keys.d) {player.vx += 5; activity = true}
        if (chat_message) {
          activity = true
          player.messages.push([millis(), chat_message]);
        }
        if (activity) player.lastActivity = millis();
      }

    } else if (message.type === 'get_data') {
      players.forEach((player) => {
        player.messages = player.messages.filter(
          (msg) => millis() - msg[0] < 8000
        );
      });
      ws.send(JSON.stringify({ type: 'player_data', players }));
    }
  });

  ws.on('close', () => {
    if (currentUsername) {
      players = players.filter((player) => player.username !== currentUsername);
      console.log(`Player disconnected: ${currentUsername}`);
    }
  });
});

setInterval(kickIdlePlayers, 60000);

function kickIdlePlayers() {

  players = players.filter((player) => {
    const socket = playerSockets.get(player.username);

    if (millis() - player.lastActivity > INACTIVITY_THRESHOLD) {
      console.log(`Kicking inactive player: ${player.username}`);
      if (socket) {
        socket.close(4000, "You have been idle for too long.");
        playerSockets.delete(player.username);
      }
      return false;
    }

    return true;
  });
}

app.get('/', (req, res) => {
  res.sendFile('app.html', { root: __dirname });
});

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
