let players = [];
let username;
let enteredUsername = "";
let lastSent = 0;
let signedIn = false;
let textField = "username";

function setup() {
    rectMode(CENTER);
    stroke(0);
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    if (!signedIn) {
        background(255, 255, 255);
        displayLoginPage();
    } else {
        background(60, 150, 255);
        if (millis() - lastSent > 100) {
            sendPlayerData();
            getPlayerData();
            lastSent = millis();
        }
        for (let i in players) {
            let username = players[i]['username'];
            let x = players[i]['x'];
            let y = players[i]['y'];
            let r = players[i]['r'];
            let g = players[i]['g'];
            let b = players[i]['b'];
            fill(r, g, b);
            square(x, y, 10);
            fill(255, 255, 255);
            text(username, x, y - 10);
        }
    }
}

function sendPlayerData() {
    const x = mouseX;
    const y = mouseY;
    const r = 0;
    const g = 255;
    const b = 0;

    fetch('http://localhost:3000/sendPlayerData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, x, y, r, g, b }),
    })
        .then(function (response) {
            return response.text();
        })
        .then(function (text) {
            console.log(text);
        })
        .catch(function (error) {
            console.error('There was a problem with the sendPlayerData operation:', error);
        });
}

function getPlayerData() {
    fetch('http://localhost:3000/getPlayerData', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => response.json())
        .then((data) => {
            players = data;
        })
        .catch((error) => {
            console.error('Fetch error:', error);
        });
}

function keyPressed() {
    if (!signedIn) {
        if (key == 'Enter') {
            username = enteredUsername;
            signedIn = true;
        } else {
            enteredUsername += key;
        }
    }
}