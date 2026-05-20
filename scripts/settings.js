// settings.js
let fenceEnabled = localStorage.getItem('fenceEnabled') === 'true';
// 1. Globaler Sound-Status
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

// 2. Audio-Objekte für UI (überall verfügbar)
const hoverSound = new Audio('/assets/sounds/coin.mp3');
const clickSound = new Audio('/assets/sounds/click.mp3');

function playSound(audioObj) {
  if (soundEnabled && audioObj) {
    // Wir erstellen eine Kopie für diesen spezifischen Klick/Hover
    // Dadurch können Sounds überlappen, ohne sich gegenseitig zu stoppen
    const soundClone = audioObj.cloneNode();
    soundClone.volume = 0.5; // Optional: UI-Sounds etwas leiser machen

    soundClone.play().catch((err) => {
      // Autoplay-Fehler abfangen
      console.log('Audio-Interaktion blockiert');
    });

    // Speicherplatz freigeben, wenn der Sound fertig ist
    soundClone.onended = function () {
      soundClone.remove();
    };
  }
}

// 4. Sound umschalten
function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', soundEnabled);
  updateSoundButtonText();
}

// 5. Button-Text aktualisieren (sucht auf jeder Seite nach dem Button)
function updateSoundButtonText() {
  const btn = document.getElementById('toggleSound');
  if (btn) {
    btn.innerText = soundEnabled ? 'Sound: AN' : 'Sound: AUS';
  }
}

function toggleFence() {
  fenceEnabled = !fenceEnabled;
  localStorage.setItem('fenceEnabled', fenceEnabled);
  updateFenceButtonText();
}

function updateFenceButtonText() {
  const btn = document.getElementById('toggleFence');
  if (btn) {
    btn.innerText = fenceEnabled ? 'Fence Mode: ON' : 'Fence Mode: OFF';
  }
}

function startSpiel() {
  playSound(clickSound);
  setTimeout(() => {
    if (fenceEnabled) {
      window.location.href = '/html/fence.html';
    } else {
      window.location.href = '/html/alienhazard.html';
    }
  }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
  updateFenceButtonText();

  const btnPlay = document.getElementById('btnPlay');
  if (btnPlay) {
    btnPlay.addEventListener('click', startSpiel);
  }
  const startScreen = document.getElementById('start-screen');

  if (startScreen) {
    startScreen.addEventListener('click', () => {
      // Audio Engine freischalten
      hoverSound
        .play()
        .then(() => {
          hoverSound.pause();
          hoverSound.currentTime = 0;
        })
        .catch(() => {});

      // Sanftes Ausfaden passend zum Spielstil
      startScreen.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      startScreen.style.opacity = '0';
      startScreen.style.transform = 'scale(1.1)'; // Ein leichter Zoom-Effekt beim Start

      setTimeout(() => {
        startScreen.remove();
      }, 600);
    });
  }

  // ... restliche Initialisierung (updateSoundUI etc.)
});
