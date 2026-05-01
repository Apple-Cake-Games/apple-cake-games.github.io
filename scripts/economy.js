const SECRET_KEY = "AppleCake-Super-Secret-99!879423712890741982074891273489031234789321049128041239847031294012387104239871209712430978";

const SKINS = {
    'default': { name: 'Green Alien', price: 0, img: '../assets/gameelements/player.png' },
    '7012734ß09172349ß075231907ß10237509ß1235': { name: 'Red Alien', price: 50, img: '../assets/gameelements/skins/red.png' },
    '4376891235609812368586089216358902163553': { name: 'Pink Alien', price: 100, img: '../assets/gameelements/skins/pink.png' },
    '7853201750213568126539062130981236508213': { name: 'Void UFO', price: 200, img: '../assets/gameelements/skins/void.png' },
    '7012865092165309812658906523906529106210': { name: 'Gold UFO', price: 500, img: '../assets/gameelements/skins/gold.png' },
};

function createHash(value) {
    let str = value.toString() + SECRET_KEY;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; 
    }
    return hash.toString();
}

function saveCoinsSecurely(amount) {
    // Speichert die Zahl als unleserlichen Base64-String
    localStorage.setItem('total_coins_v1', btoa(amount.toString()));
    localStorage.setItem('total_coins_token', createHash(amount));
}

function getTotalCoins() {
    let encodedValue = localStorage.getItem('total_coins_v1');
    const token = localStorage.getItem('total_coins_token');
    if (!encodedValue) return 0;
    
    let total;
    try {
        total = parseInt(atob(encodedValue)) || 0;
    } catch(e) { return 0; }

    // Checkt, ob der Hash zur Zahl passt
    if (token !== createHash(total)) {
        console.error("Manipulation erkannt!");
        saveCoinsSecurely(0); // Reset
        return 0;
    }
    return total;
}

function addCoinsToAccount(amount) {
    let currentTotal = getTotalCoins();
    saveCoinsSecurely(currentTotal + amount);
}

function openShop() {
    const overlay = document.getElementById('shop-overlay');
    if (overlay) {
        overlay.style.display = 'block';
        renderShop(); 
    }
}

function closeShop() {
    const overlay = document.getElementById('shop-overlay');
    if (overlay) overlay.style.display = 'none';
}

function renderShop() {
    const skinList = document.getElementById('skin-list');
    const balance = document.getElementById('shop-balance');
    if (!skinList) return;

    if (balance) balance.innerText = getTotalCoins();

    const ownedSkins = JSON.parse(localStorage.getItem('owned_skins')) || ['default'];
    const activeSkin = localStorage.getItem('equipped_skin') || 'default';
    
    skinList.innerHTML = ''; 

    for (const [id, skin] of Object.entries(SKINS)) {
        const isOwned = ownedSkins.includes(id);
        const isActive = activeSkin === id;

        skinList.innerHTML += `
            <div class="shop-item ${isActive ? 'equipped' : ''}">
                <span>${skin.name} ${!isOwned ? `(${skin.price} <img src="/assets/gameelements/ui/Coin.png" style="vertical-align: middle; margin-bottom: 2px; width: 18px;">)` : ''}</span>
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
        saveCoinsSecurely(currentTotal - skin.price);
        ownedSkins.push(skinId);
        localStorage.setItem('owned_skins', JSON.stringify(ownedSkins));
        renderShop();
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