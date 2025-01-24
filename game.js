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
    const speed = canvas.width * 0.005; // 0.5% der Bildschirmbreite pro Frame
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
    e.preventDefault(); // Verhindert Zoom/Scroll auf Mobilgeräten
    jump();
});

gameLoop();
