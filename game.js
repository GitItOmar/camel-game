const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const camelImg = new Image();
camelImg.src = "camel.png"; // Pfad zum Kamel-Bild

const camel = {
    x: 50, // Starting x position
    y: canvas.height - 100, // Starting y position 
    width: 100,
    height: 100,
    velocityY: 0,
    gravity: 0.8,
    jumps: 0, // Zählt die Anzahl der Sprünge
    maxJumps: 2 // Maximale Anzahl der Sprünge
};

let gameState = 'start'; // Ändern zu: 'start', 'running', 'gameover'
let score = 0;
let highScore = localStorage.getItem('highScore') || 0; // Speichert den Highscore

function drawCamel() {
    ctx.drawImage(camelImg, camel.x, camel.y, camel.width, camel.height);
}

function updateCamel() {
    camel.velocityY += camel.gravity;
    camel.y += camel.velocityY;

    if (camel.y > canvas.height - camel.height) {
        camel.y = canvas.height - camel.height;
        camel.velocityY = 0;
        camel.jumps = 0; // Reset jumps when touching ground
    }
}

function jump() {
    if (camel.jumps < camel.maxJumps) {
        camel.velocityY = -20;
        camel.jumps++;
    }
}

// Event Listener für Tastatur anpassen
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        if (gameState === 'start') {
            score = 0;
            gameState = 'running';
        } else if (gameState === 'running') {
            jump();
        } else if (gameState === 'gameover') {
            score = 0;
            obstacles.length = 0;
            camel.y = canvas.height - camel.height;
            camel.velocityY = 0;
            camel.jumps = 0;
            gameState = 'running';
        }
    }
});

// Auch den Click-Event Listener anpassen (für Mausklicks)
canvas.addEventListener("click", (e) => {
    if (gameState === 'start') {
        score = 0;
        gameState = 'running';
    } else if (gameState === 'running') {
        jump();
    } else if (gameState === 'gameover') {
        score = 0;
        obstacles.length = 0;
        camel.y = canvas.height - camel.height;
        camel.velocityY = 0;
        camel.jumps = 0;
        gameState = 'running';
    }
});

const obstacles = [];
const obstacleWidth = 30;
const obstacleHeight = 50;

function createObstacle() {
    const height = Math.min(canvas.height * 0.15, 50); // max 15% der Bildschirmhöhe
    const width = Math.min(canvas.width * 0.06, 30);  // max 6% der Bildschirmbreite
    obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        width: width,
        height: height
    });
}

function updateObstacles() {
    const speed = canvas.width * 0.005;
    if (gameState === 'running') {
        score += 0.1; // Erhöhe Score während des Spiels
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
    }
    
    obstacles.forEach((obs, index) => {
        obs.x -= speed;
        if (obs.x + obs.width < 0) obstacles.splice(index, 1);
    });
    
    if (Math.random() < 0.02) createObstacle();
}

function drawObstacles() {
    ctx.fillStyle = "green";
    obstacles.forEach(obs => ctx.fillRect(obs.x, obs.y, obstacleWidth, obstacleHeight));
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${Math.floor(score)}`, 20, 40);
    ctx.fillText(`Highscore: ${Math.floor(highScore)}`, 20, 70);
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Schade Elisa!', canvas.width / 2, canvas.height / 2 - 50);
    
    ctx.font = '32px Arial';
    ctx.fillText(`Score: ${Math.floor(score)}`, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText(`Highscore: ${Math.floor(highScore)}`, canvas.width / 2, canvas.height / 2 + 50);
    
    ctx.font = '24px Arial';
    ctx.fillText('Tippe zum Neustart', canvas.width / 2, canvas.height / 2 + 100);
}

function checkCollision() {
    obstacles.forEach(obs => {
        if (
            camel.x < obs.x + obs.width &&
            camel.x + camel.width > obs.x &&
            camel.y < obs.y + obs.height &&
            camel.y + camel.height > obs.y
        ) {
            gameState = 'gameover';
        }
    });
}

// Startbildschirm Funktion
function drawStartScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Kamelrennen', canvas.width / 2, canvas.height / 3);
    
    ctx.font = '24px Arial';
    ctx.fillText('Tippe zum Springen', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Doppelsprung möglich!', canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText('Weiche den Kakteen aus', canvas.width / 2, canvas.height / 2 + 80);
    
    ctx.font = '32px Arial';
    ctx.fillText('Tippe zum Start', canvas.width / 2, canvas.height * 0.8);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'start') {
        drawCamel();
        drawStartScreen();
    } else if (gameState === 'running') {
        drawCamel();
        updateCamel();
        updateObstacles();
        drawObstacles();
        drawScore();
        checkCollision();
    } else if (gameState === 'gameover') {
        drawCamel();
        drawObstacles();
        drawGameOver();
    }

    requestAnimationFrame(gameLoop);
}

// Canvas Größe dynamisch anpassen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Kamel-Größe relativ zur Bildschirmgröße anpassen
    camel.width = Math.min(canvas.width * 0.2, 100); // max 20% der Bildschirmbreite
    camel.height = camel.width;

    // Y-Position neu berechnen
    camel.y = canvas.height - camel.height;
}

// Event Listener für Bildschirmgrößenänderungen
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial aufrufen

// Touch Events für mobile Steuerung hinzufügen
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (gameState === 'start') {
        score = 0;
        gameState = 'running';
    } else if (gameState === 'running') {
        jump();
    } else if (gameState === 'gameover') {
        score = 0;
        obstacles.length = 0;
        camel.y = canvas.height - camel.height;
        camel.velocityY = 0;
        camel.jumps = 0;
        gameState = 'running';
    }
});

gameLoop();
