const SECRET_KEY = "AppleCake-Super-Secret-99!879423712890741982074891273489031234789321049128041239847031294012387104239871209712430978";

const SKINS = {
    'default': { name: 'Standard UFO', price: 0, img: '../assets/gameelements/player.png' },
    'neon': { name: 'Neon Scout', price: 150, img: '../assets/gameelements/player_neon.png' },
    'gold': { name: 'Gold Edition', price: 500, img: '../assets/gameelements/player_gold.png' }
};

function createHash(value) {
    let str = value + SECRET_KEY;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; 
    }
    return hash.toString();
}

function getTotalCoins() {
    let total = parseInt(localStorage.getItem('total_coins_v1')) || 0;
    const token = localStorage.getItem('total_coins_token');
    if (token !== createHash(total)) {
        console.warn("Coin-Manipulation erkannt!");
    }
    return total;
}

function addCoinsToAccount(amount) {
    let currentTotal = getTotalCoins();
    let newTotal = currentTotal + amount;
    localStorage.setItem('total_coins_v1', newTotal);
    localStorage.setItem('total_coins_token', createHash(newTotal));
}

// --- NEU: SHOP LOGIK (Damit der Button funktioniert) ---

function openShop() {
    const overlay = document.getElementById('shop-overlay');
    const balance = document.getElementById('shop-balance');
    
    if (overlay) {
        overlay.style.display = 'block';
        if (balance) balance.innerText = getTotalCoins();
        renderShop(); // Zeichnet die Skin-Liste
    }
}

function closeShop() {
    const overlay = document.getElementById('shop-overlay');
    if (overlay) overlay.style.display = 'none';
}

function renderShop() {
    const skinList = document.getElementById('skin-list');
    if (!skinList) return;

    const ownedSkins = JSON.parse(localStorage.getItem('owned_skins')) || ['default'];
    const activeSkin = localStorage.getItem('equipped_skin') || 'default';
    
    skinList.innerHTML = ''; 

    for (const [id, skin] of Object.entries(SKINS)) {
        const isOwned = ownedSkins.includes(id);
        const isActive = activeSkin === id;

        skinList.innerHTML += `
            <div class="shop-item ${isActive ? 'equipped' : ''}">
                <span>${skin.name} ${!isOwned ? `(${skin.price} 💎)` : ''}</span>
                ${isOwned 
                    ? `<button class="shop-btn" onclick="equipSkin('${id}')">${isActive ? 'Aktiv' : 'Nutzen'}</button>`
                    : `<button class="shop-btn" onclick="buySkin('${id}')">Kaufen</button>`
                }
            </div>
        `;
    }
}

function buySkin(skinId) {
    const skin = SKINS[skinId];
    let currentTotal = getTotalCoins();
    let ownedSkins = JSON.parse(localStorage.getItem('owned_skins')) || ['default'];

    if (currentTotal >= skin.price) {
        let newTotal = currentTotal - skin.price;
        localStorage.setItem('total_coins_v1', newTotal);
        localStorage.setItem('total_coins_token', createHash(newTotal));
        
        ownedSkins.push(skinId);
        localStorage.setItem('owned_skins', JSON.stringify(ownedSkins));
        
        renderShop();
        // Checkt ob die Funktion im Spiel existiert um Anzeige zu updaten
        if (typeof updateHighscoreDisplay === "function") updateHighscoreDisplay();
    } else {
        alert("Nicht genug Kristalle!");
    }
}

function equipSkin(skinId) {
    localStorage.setItem('equipped_skin', skinId);
    loadEquippedSkin();
    renderShop();
}

function loadEquippedSkin() {
    const activeSkinId = localStorage.getItem('equipped_skin') || 'default';
    const playerEl = document.getElementById('player');
    if (playerEl && SKINS[activeSkinId]) {
        playerEl.style.backgroundImage = `url('${SKINS[activeSkinId].img}')`;
    }
}