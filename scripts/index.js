const btnplay = document.getElementById("btnPlay");
const btnGit = document.getElementById("icnGithub");
const btnShop = document.getElementById("btnShop");
const btnSettings = document.getElementById("btnSettings");
const btnQuit = document.getElementById("btnQuit");

btnplay.addEventListener("click", function(){

    window.open("/html/alienhazard.html", "_self");

});

btnGit.addEventListener("click", function(){
    window.open("https://github.com/Apple-Cake-Games/apple-cake-games.github.io", "_self");
})

btnShop.addEventListener("click", function(){
    openShop();
})

function closeSettings() {
    const overlay = document.getElementById('settings-overlay');
    if (overlay) overlay.style.display = 'none';
}


btnSettings.addEventListener("click", function(){
    const overlay = document.getElementById('settings-overlay');
    if (overlay) overlay.style.display = 'block';
});


let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    document.getElementById('toggleSound').innerText = soundEnabled ? "Sound: AN" : "Sound: AUS";
}

document.addEventListener('DOMContentLoaded', () => {
    const soundBtn = document.getElementById('toggleSound');
    if(soundBtn) soundBtn.innerText = soundEnabled ? "Sound: AN" : "Sound: AUS";
});

btnQuit.addEventListener("click", function(){
    window.open("https://www.youtube.com/watch?v=Aq5WXmQQooo", "_self")
})

const btnCredits = document.getElementById("btnCredits");

// Credits öffnen
btnCredits.addEventListener("click", function() {
    const overlay = document.getElementById('credits-overlay');
    if (overlay) overlay.style.display = 'block';
});

// Credits schließen
function closeCredits() {
    const overlay = document.getElementById('credits-overlay');
    if (overlay) overlay.style.display = 'none';
}