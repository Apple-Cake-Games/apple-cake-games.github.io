const SECRET_KEY =
  'AppleCake-Super-Secret-99!879423712890741982074891273489031234789321049128041239847031294012387104239871209712430978';

const SKINS = {
  default: {
    name: 'Green Alien',
    price: 0,
    img: '../assets/gameelements/player.png',
  },
  '7012734ß09172349ß075231907ß10237509ß1235': {
    name: 'Red Alien',
    price: 50,
    img: '../assets/gameelements/skins/red.png',
  },
  '4376891235609812368586089216358902163553': {
    name: 'Pink Alien',
    price: 100,
    img: '../assets/gameelements/skins/pink.png',
  },
  '7853201750213568126539062130981236508213': {
    name: 'Void UFO',
    price: 200,
    img: '../assets/gameelements/skins/void.png',
  },
  '7012865092165309812658906523906529106210': {
    name: 'Gold UFO',
    price: 500,
    img: '../assets/gameelements/skins/gold.png',
  },
  '32479023479023479023ß12370ß92134709ß2144': {
    name: 'AppleCakeGameSpecial',
    price: 10000,
    img: '../assets/gameelements/skins/AppleCakeGamesSpecial.png',
  },
};

const MAPS = {
  '790ß23170ß712ß07124': {
    name: 'Moon',
    price: 0,
    img: '/assets/gameelements/background.png',
    coinImg: '/assets/gameelements/christal_pink.png',
    obstacleImg: '/assets/gameelements/crater1.png',
    coinSound: '/assets/sounds/coin.mp3', // Standard Sound
  },
  '3247902347902347902': {
    name: 'Green Fields',
    price: 750,
    img: '/assets/gameelements/maps/Green_Fields.png',
    coinImg: '/assets/gameelements/plant_flower.png',
    obstacleImg: '/assets/gameelements/crater1.png',
    coinSound: '/assets/sounds/coin.mp3', // Spezieller Sound für Blumen
  },
};

const DEFAULT_MAP_ID = '790ß23170ß712ß07124';

function loadEquippedMap() {
  // 1. Prüfen, wo wir sind
  const path = window.location.pathname;
  const page = path.split('/').pop();

  // 2. Nur ausführen, wenn wir NICHT auf der Startseite sind
  if (page === 'index.html' || page === '') {
    console.log('Map-Wechsel auf Index blockiert.');
    return;
  }

  // 3. Eigentliche Logik zum Ändern des Hintergrunds
  const activeMapId = localStorage.getItem('equipped_map') || DEFAULT_MAP_ID;
  if (MAPS[activeMapId]) {
    document.body.style.backgroundImage = `url('${MAPS[activeMapId].img}')`;
    document.body.style.backgroundSize = 'cover';
  }
}

function unlockSkin(skinId) {
  // 1. Liste der besessenen Skins holen
  let ownedSkins = JSON.parse(localStorage.getItem('owned_skins')) || [
    'default',
  ];

  // 2. Prüfen, ob der Skin schon da ist
  if (!ownedSkins.includes(skinId)) {
    ownedSkins.push(skinId);
    localStorage.setItem('owned_skins', JSON.stringify(ownedSkins));
    alert('Glückwunsch! Skin freigeschaltet.');
  } else {
    alert('Diesen Skin hast du schon!');
  }

  // 3. Shop-Anzeige sofort updaten, falls er offen ist
  if (typeof renderShop === 'function') {
    renderShop();
  }
}

// --- CORE SYSTEM ---
function createHash(value) {
  let str = value.toString() + SECRET_KEY;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

function saveCoinsSecurely(amount) {
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
  } catch (e) {
    return 0;
  }
  if (token !== createHash(total)) {
    saveCoinsSecurely(0);
    return 0;
  }
  return total;
}

function addCoinsToAccount(amount) {
  saveCoinsSecurely(getTotalCoins() + amount);
}

// --- SHOP LOGIC ---
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

  const ownedSkins = JSON.parse(localStorage.getItem('owned_skins')) || [
    'default',
  ];
  const activeSkin = localStorage.getItem('equipped_skin') || 'default';
  const ownedMaps = JSON.parse(localStorage.getItem('owned_maps')) || [
    DEFAULT_MAP_ID,
  ];
  const activeMap = localStorage.getItem('equipped_map') || DEFAULT_MAP_ID;

  skinList.innerHTML = '<h3>--- SKINS ---</h3>';
  for (const [id, skin] of Object.entries(SKINS)) {
    const isOwned = ownedSkins.includes(id) || id === 'default';
    skinList.innerHTML += generateShopItemHTML(
      id,
      skin,
      isOwned,
      activeSkin === id,
      'equipSkin',
      'buySkin'
    );
  }

  skinList.innerHTML += '<h3 style="margin-top:20px;">--- MAPS ---</h3>';
  for (const [id, map] of Object.entries(MAPS)) {
    const isOwned = ownedMaps.includes(id) || id === DEFAULT_MAP_ID;
    skinList.innerHTML += generateShopItemHTML(
      id,
      map,
      isOwned,
      activeMap === id,
      'equipMap',
      'buyMap'
    );
  }
}

function generateShopItemHTML(id, item, isOwned, isActive, equipFunc, buyFunc) {
  return `
        <div class="shop-item ${isActive ? 'equipped' : ''}">
            <span>${item.name} ${!isOwned ? `(${item.price} <img src="/assets/gameelements/ui/Coin.png" style="vertical-align: middle; width: 18px;">)` : ''}</span>
            ${
              isOwned
                ? `<button class="shop-btn" onclick="${equipFunc}('${id}')">${isActive ? 'Aktiv' : 'Nutzen'}</button>`
                : `<button class="shop-btn" onclick="${buyFunc}('${id}')">Kaufen</button>`
            }
        </div>
    `;
}

function buyMap(mapId) {
  const map = MAPS[mapId];
  let currentTotal = getTotalCoins();
  let ownedMaps = JSON.parse(localStorage.getItem('owned_maps')) || [
    DEFAULT_MAP_ID,
  ];
  if (currentTotal >= map.price) {
    saveCoinsSecurely(currentTotal - map.price);
    ownedMaps.push(mapId);
    localStorage.setItem('owned_maps', JSON.stringify(ownedMaps));
    renderShop();
  } else {
    alert('Nicht genug Kristalle!');
  }
}

function equipMap(mapId) {
  localStorage.setItem('equipped_map', mapId);

  // loadEquippedMap prüft jetzt selbst, ob sie den Hintergrund ändern darf
  loadEquippedMap();

  renderShop();
}

function buySkin(skinId) {
  const skin = SKINS[skinId];
  let currentTotal = getTotalCoins();
  let ownedSkins = JSON.parse(localStorage.getItem('owned_skins')) || [
    'default',
  ];
  if (currentTotal >= skin.price) {
    saveCoinsSecurely(currentTotal - skin.price);
    ownedSkins.push(skinId);
    localStorage.setItem('owned_skins', JSON.stringify(ownedSkins));
    renderShop();
  } else {
    alert('Nicht genug Kristalle!');
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

// --- INITIALISIERUNG ---
function initCosmetics() {
  const page = window.location.pathname.split('/').pop();

  // Skin wird immer versucht zu laden (falls Player-Div da ist)
  loadEquippedSkin();

  // Map wird NUR geladen, wenn wir NICHT auf der index.html sind
  // Falls "page" leer ist (Server-Root), gilt das auch als Startseite
  if (page !== 'index.html' && page !== '') {
    loadEquippedMap();
  }
}

// WICHTIG: Nur dieser eine Aufruf darf hier stehen!
initCosmetics();
