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

// Event Listener für Mausklick und Leertaste
canvas.addEventListener("click", jump);
window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        jump();
    }
});

const obstacles = [];
const obstacleWidth = 30;
const obstacleHeight = 50;

function createObstacle() {
    obstacles.push({ x: canvas.width, y: canvas.height - obstacleHeight });
}

function updateObstacles() {
    obstacles.forEach((obs, index) => {
        obs.x -= 5; // Bewegung nach links
        if (obs.x + obstacleWidth < 0) obstacles.splice(index, 1); // Entfernen, wenn aus dem Bild
    });

    if (Math.random() < 0.02) createObstacle(); // Zufällig Kakteen spawnen
}

function drawObstacles() {
    ctx.fillStyle = "green";
    obstacles.forEach(obs => ctx.fillRect(obs.x, obs.y, obstacleWidth, obstacleHeight));
}

function checkCollision() {
    obstacles.forEach(obs => {
        if (
            camel.x < obs.x + obstacleWidth &&
            camel.x + camel.width > obs.x &&
            camel.y < obs.y + obstacleHeight &&
            camel.y + camel.height > obs.y
        ) {
            alert("Schade Elisa! 🐪");
            window.location.reload(); // Neustart
        }
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCamel();
    updateCamel();

    updateObstacles();
    drawObstacles();

    checkCollision();

    requestAnimationFrame(gameLoop);
}

gameLoop();
