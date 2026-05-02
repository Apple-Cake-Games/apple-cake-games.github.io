    const player = document.getElementById('player');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score');
    const highscoreDisplay = document.getElementById('highscore-list');
    const gameContainer = document.getElementById('game-container');
    const clockDisplay = document.getElementById('real-clock');

    let isShielded = false;
    let shieldTimer = 0;
    const itemDisplay = document.getElementById('item-display');
    const itemTimerText = document.getElementById('item-timer');

    const coinSound = new Audio("/assets/sounds/coin.mp3");
    const gameoverSound = new Audio("/assets/sounds/gameover.mp3");

    let score = 0;
    let posX = 100, posY = 100;
    const baseSpeed = 5; 
    let speedMultiplier = 1; 
    let currentDir = 'd'; 
    const startTime = Date.now();
    let gameOver = false;

    const obstacles = [];
    let currentCoin = null;





    

        // Button-Text beim Laden korrekt setzen
        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('toggleSound').innerText = soundEnabled ? "Sound: AN" : "Sound: AUS";
        });









    function updateClock() {
        const now = new Date();
        clockDisplay.innerText = now.toLocaleDateString('de-DE') + " | " + now.toLocaleTimeString('de-DE');
    }
    setInterval(updateClock, 1000);
    updateClock();

function updateHighscoreDisplay() {
    // 1. Highscores aus dem Speicher laden
    let scores = JSON.parse(localStorage.getItem('game_scores_v2')) || [];
    
    // 2. Validierung mit deinem Hash-System
    const validScores = scores.filter(s => {
        const checkHash = createHash(s.points);
        return s.securityToken === checkHash;
    });

    // 3. Die Highscore-Liste im HTML befüllen
    highscoreDisplay.innerHTML = validScores.length > 0 
        ? validScores.map((s, i) => `${i+1}. <b>${s.points} Pkt</b> <small>${s.date}</small>`).join('<br>')
        : "Keine Rekorde";
        
    // 4. Gesamt-Coins im Scoreboard aktualisieren
    const totalDisplay = document.getElementById('total-coins-display');
    if (totalDisplay) {
        totalDisplay.innerText = getTotalCoins();
    }

    // Sicherheits-Warnung in der Konsole
    if (validScores.length !== scores.length) {
        console.warn("Manipulation erkannt!");
    }
}


        // Funktion zum Spawnen des Schildes (ähnlich wie Kristall, aber seltener)
function spawnShield() {
    if (gameOver || document.querySelector('.shield')) return;
    
    const shield = document.createElement('div');
    shield.className = 'shield'; // Hier wird die CSS-Klasse zugewiesen
    
    // Position berechnen
    const x = Math.random() * (window.innerWidth - 40);
    const y = Math.random() * (window.innerHeight - 40);
    
    shield.style.left = x + 'px';
    shield.style.top = y + 'px';
    
    gameContainer.appendChild(shield);

    // Schild verschwindet nach 7 Sekunden, wenn nicht gesammelt
    setTimeout(() => { 
        if(shield.parentElement) shield.remove(); 
    }, 17000);
}


function saveScore(newPoints) {
    // 1. Highscores speichern (Top 3)
    let scores = JSON.parse(localStorage.getItem('game_scores_v2')) || [];
    const now = new Date();
    const dateStr = now.toLocaleDateString('de-DE') + " " + now.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'});
    
    const newEntry = { 
        points: newPoints, 
        date: dateStr, 
        securityToken: createHash(newPoints) // Nutzt den Hash aus economy.js
    };
    
    scores.push(newEntry);
    scores.sort((a, b) => b.points - a.points);
    localStorage.setItem('game_scores_v2', JSON.stringify(scores.slice(0, 3)));

    // 2. WICHTIG: Punkte sicher auf das globale Coin-Konto packen
    addCoinsToAccount(newPoints); 
}

    function createObstacle(x, y) {
        const obs = document.createElement('div');
        obs.className = 'obstacle';
        obs.style.left = x + 'px';
        obs.style.top = y + 'px';
        gameContainer.appendChild(obs);
        obstacles.push(obs);
    }

    function spawnCoin() {
        if (gameOver) return;
        const coin = document.createElement('div');
        coin.className = 'coin';
        const x = Math.random() * (window.innerWidth - 40);
        const y = Math.random() * (window.innerHeight - 34);
        coin.style.left = x + 'px';
        coin.style.top = y + 'px';
        gameContainer.appendChild(coin);
        currentCoin = coin;
    }

    function checkCollision(r1, r2) {
        return !(r1.right < r2.left || r1.left > r2.right || 
                 r1.bottom < r2.top || r1.top > r2.bottom);
    }

    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (['w', 'a', 's', 'd'].includes(key)) currentDir = key;
    });

    // Wisch-Steuerung
    let touchStartX = 0;
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, {passive: false});

    window.addEventListener('touchend', (e) => {
        if (touchStartX === 0 || touchStartY === 0) return;
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(diffX) > 30 || Math.abs(diffY) > 30) {
            currentDir = Math.abs(diffX) > Math.abs(diffY) ? (diffX > 0 ? 'd' : 'a') : (diffY > 0 ? 's' : 'w');
        }
        touchStartX = 0; touchStartY = 0;
    }, {passive: false});

    function update() {
        if (gameOver) return;

        timerDisplay.innerText = ((Date.now() - startTime) / 1000).toFixed(2);

        // Bewegungslogik mit Geschwindigkeits-Multiplikator
        let currentSpeed = baseSpeed * speedMultiplier;
        if (currentDir === 'w') posY -= currentSpeed;
        if (currentDir === 's') posY += currentSpeed;
        if (currentDir === 'a') posX -= currentSpeed;
        if (currentDir === 'd') posX += currentSpeed;

                // Screen Wrapping Logik
        if (posX < -60) posX = window.innerWidth;
        if (posX > window.innerWidth) posX = -60;
        if (posY < -45) posY = window.innerHeight;
        if (posY > window.innerHeight) posY = -45;

        player.style.left = posX + 'px';
        player.style.top = posY + 'px';


        const playerRect = player.getBoundingClientRect();

        // 1. Kristall einsammeln
        if (currentCoin && checkCollision(playerRect, currentCoin.getBoundingClientRect())) {
            score++;
            scoreDisplay.innerText = score;
            if (speedMultiplier < 2.0) speedMultiplier += 0.02;

            const x = parseFloat(currentCoin.style.left);
            const y = parseFloat(currentCoin.style.top);
            currentCoin.remove();
            currentCoin = null;
            playSound(coinSound);
            setTimeout(() => { createObstacle(x, y); }, 500);
            setTimeout(spawnCoin, 2000);
        }

// 1. Kollisionsprüfung für Schild
        const shieldElement = document.querySelector('.shield');
        if (shieldElement && checkCollision(playerRect, shieldElement.getBoundingClientRect())) {
            shieldElement.remove();
            isShielded = true;
            shieldTimer = 4;
            player.classList.add('shield-active');
            itemDisplay.style.display = 'block';
        }

        // 2. Schild-Timer Logik
        if (isShielded) {
            shieldTimer -= 0.016; 
            itemTimerText.innerText = shieldTimer.toFixed(1);
            if (shieldTimer <= 0) {
                isShielded = false;
                player.classList.remove('shield-active');
                itemDisplay.style.display = 'none';
            }
        }
        
        // 3. EINE EINZIGE Hindernis-Prüfung (Die neue Version)
        obstacles.forEach(obs => {
            if (checkCollision(playerRect, obs.getBoundingClientRect())) {
                if (!isShielded) { 
                    // Nur wenn KEIN Schild aktiv ist, ist das Spiel vorbei
                    gameOver = true;
                    saveScore(score);
                    playSound(gameoverSound);
                    document.getElementById('final-score').innerText = score;
                    document.getElementById('game-over-screen').style.display = 'block';
                } else {
                    // Schild-Bonus: Hindernis wird zerstört
                    obs.remove();
                    obstacles.splice(obstacles.indexOf(obs), 1);
                }
            }
            
        });

        requestAnimationFrame(update);
    }

    updateHighscoreDisplay();
    spawnCoin();
    loadEquippedSkin();
    loadEquippedMap();
    update();
        // Ruft die Funktion alle 15-25 Sekunden auf
    setInterval(() => {
        if (!gameOver && Math.random() > 0.5) spawnShield();
    }, 15000);