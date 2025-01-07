let ws;
let connected = false;
let reconnecting = false;

let players = [];

let username;
let r, g, b = 255;
let keys = { w: false, a: false, s: false, d: false };

let lastSent = 0;

let chat_message;
let current_chat = "";
let chatting = false;

function setup() {
    rectMode(CENTER);
    textAlign(CENTER);
    stroke(0);
    createCanvas(windowWidth, windowHeight);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    connectWebSocket();
}

function draw() {
    resizeCanvas(windowWidth, windowHeight);
    if (!connected) {
        background(100);
        fill(255, 255, 255);
        textSize(32);
        text("Trying to connect...", windowWidth * 0.5, windowHeight * 0.5);
        if (!reconnecting) {
            reconnecting = true;
            setTimeout(() => {
                connectWebSocket();
                reconnecting = false;
            }, 5000);
        }
    }
    else if (!signedIn) {
        background(255, 155, 0);
        fill(255, 255, 255);
        rect(windowWidth * 0.5, windowHeight * 0.5, windowWidth * 0.9, windowHeight * 0.9)
        displayLoginPage();
    } else {
        background(60, 150, 255);
        fill(255, 255, 255);
        textSize(16);
        text("Use WASD to move, press t then type to chat! (Press Enter to send)", windowWidth * 0.5, 40);
        text("More will be here soon...", windowWidth * 0.5, 70);
        text("V Alpha.0.0", 50, windowHeight - 20)
        if (millis() - lastSent > 10) {
            sendPlayerData();
            getPlayerData();
            lastSent = millis();
        }
        stroke(0)
        for (let i in players) {
            player = players[i];

            fill(player.r, player.g, player.b);
            square(player.x, player.y, 10);
            fill(255, 255, 255);
            textSize(12);
            text(player.username, player.x, player.y - 10);
            if (!chatting || player.username != username) {
                for (let i in player.messages) {
                    text(player.messages[i][1], player.x, player.y + 20 + (i * 15));
                }
            } else {
                for (let i in player.messages) {
                    text(player.messages[i][1], player.x, player.y + 40 + (i * 15));
                }
                textStyle(ITALIC);
                fill(0, 0, 0);
                rect(player.x, player.y + 20, current_chat.length * 5 + 10, 20);
                fill(255, 255, 255);
                text(current_chat, player.x, player.y + 20);
                textStyle(NORMAL);
            }
        }
    }
}

function connectWebSocket() {
    if (connected) return;

    console.log("Attempting to reconnect...");
    ws = new WebSocket('ws://34.230.166.208:3000');

    ws.onopen = () => {
        connected = true;
        reconnecting = false;
        console.log("WebSocket connection established.");
    };

    ws.onclose = (event) => {
        connected = false;
        signedIn = false;
        if (event.code == 4000) {
        displayLoginError("You were kicked for inactivity")
        }
        console.log("WebSocket connection closed.");
    };

    ws.onerror = (error) => {
        connected = false;
        signedIn = false;
        console.error("WebSocket encountered an error:", error);
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'login_failed') {
            displayLoginError(message.message);
        } else if (message.type === 'login_success') {
            signedIn = true;
        } else if (message.type === 'player_data') {
            players = message.players;
        }
    };
}

function sendPlayerData() {
    const x = mouseX;
    const y = mouseY;
    const message = {
        type: 'update',
        username,
        keys,
        chat_message,
    };
    ws.send(JSON.stringify(message));
    chat_message = null;
}

function getPlayerData() {
    const message = { type: 'get_data' };
    ws.send(JSON.stringify(message));
}

async function loginPlayer() {
    x = windowWidth * 0.5;
    y = windowHeight * 0.4;
    const message = {
        type: 'login',
        username,
        r,
        g,
        b,
        x,
        y,
    };
    ws.send(JSON.stringify(message));
}

function mousePressed() {
    if (!signedIn && (windowWidth * 0.5) - 120 < mouseX && mouseX < (windowWidth * 0.5) - 120 + 255 && (windowHeight * 0.5) - 120 < mouseY && mouseY < (windowHeight * 0.5) - 120 + 255) {
        selectedColor = true;
        mousePressX = mouseX;
        mousePressY = mouseY;
    }
}

async function keyPressed() {
    if (!signedIn) {
        if (key === 'Enter') {
            if (selectedColor && enteredUsername !== "") {
                r = mousePressX - (windowWidth * 0.5) + 120;
                g = 255 - (mousePressX - (windowWidth * 0.5) + 120);
                b = mousePressY - (windowHeight * 0.5) + 120;
                username = enteredUsername;

                const success = await loginPlayer();
                if (success) {
                    signedIn = true;
                } else {
                    displayLoginError("Joining...");
                }
            } else {
                displayLoginError("Make sure you have a username and color selected!");
            }
        } else if (key === 'Backspace') {
            enteredUsername = enteredUsername.slice(0, -1);
        } else if (key.length === 1) {
            enteredUsername += key;
        }
    } else if (!chatting) {
        if (key == 't') {
            chatting = true;
        }
    } else if (chatting) {
        if (key == 'Enter') {
            chat_message = current_chat;
            current_chat = "";
            chatting = false;
        } else if (key == 'Backspace') {
            current_chat = current_chat.slice(0, -1);
        } else if (key == 'Escape') {
            chatting = false;
        } else if (key.length == 1) {
            current_chat += key;
        }
    }
}

function handleKeyDown(event) {
    if (!chatting) {
        if (event.key.toLowerCase() === 'w') keys.w = true;
        if (event.key.toLowerCase() === 'a') keys.a = true;
        if (event.key.toLowerCase() === 's') keys.s = true;
        if (event.key.toLowerCase() === 'd') keys.d = true;
    }
}

function handleKeyUp(event) {
    if (event.key.toLowerCase() === 'w') keys.w = false;
    if (event.key.toLowerCase() === 'a') keys.a = false;
    if (event.key.toLowerCase() === 's') keys.s = false;
    if (event.key.toLowerCase() === 'd') keys.d = false;
}