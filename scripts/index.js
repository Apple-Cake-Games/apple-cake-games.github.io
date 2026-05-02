const btnplay = document.getElementById('btnPlay');
const btnGit = document.getElementById('icnGithub');
const btnShop = document.getElementById('btnShop');
const btnSettings = document.getElementById('btnSettings');
const btnQuit = document.getElementById('btnQuit');

btnplay.addEventListener('click', function () {
  window.open('/html/alienhazard.html', '_self');
});

btnGit.addEventListener('click', function () {
  window.open('https://github.com/Apple-Cake-Games/apple-cake-games.github.io');
  const hasBonus = localStorage.getItem('bonus_github_claimed');

  if (!hasBonus) {
    alert("Thank you for opening our GitHub-Profile! You've got a free skin!");
    unlockSkin('32479023479023479023ß12370ß92134709ß2144');
    localStorage.setItem('bonus_github_claimed', 'true');
  }
});

btnShop.addEventListener('click', function () {
  openShop();
});

function closeSettings() {
  const overlay = document.getElementById('settings-overlay');
  if (overlay) overlay.style.display = 'none';
}

btnSettings.addEventListener('click', function () {
  const overlay = document.getElementById('settings-overlay');
  if (overlay) overlay.style.display = 'block';
});

btnQuit.addEventListener('click', function () {
  window.open('https://www.youtube.com/watch?v=Aq5WXmQQooo', '_self');
});

const btnCredits = document.getElementById('btnCredits');

// Credits öffnen
btnCredits.addEventListener('click', function () {
  const overlay = document.getElementById('credits-overlay');
  if (overlay) overlay.style.display = 'block';
});

// Credits schließen
function closeCredits() {
  const overlay = document.getElementById('credits-overlay');
  if (overlay) overlay.style.display = 'none';
}
