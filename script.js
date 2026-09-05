// ================================
// MISSILE ARENA - FULL JS
// ================================

let player = {
  money: 0,
  level: 1,
  xp: 0,

  currentGun: "AK-47",
  currentMissile: "Scud-B",

  currentDefense: 25,
  currentVest: 25,
  currentVestDurability: 25,

  ownedGuns: {
    "AK-47": true
  },

  ownedMissiles: {
    "Scud-B": true
  },

  ownedDefense: {
    25: true
  },

  ownedVests: {
    25: true
  },

  ammo: {
    "AK-47": 10
  },

  missileAmmo: {
    "Scud-B": 2
  }
};


// ================================
// LOAD SAVED DATA
// ================================

try {
  const saved = localStorage.getItem("missileArenaPlayer");

  if (saved) {
    const data = JSON.parse(saved);

    if (data && typeof data === "object") {
      player = {
        ...player,
        ...data,

        ownedGuns: {
          ...player.ownedGuns,
          ...(data.ownedGuns || {})
        },

        ownedMissiles: {
          ...player.ownedMissiles,
          ...(data.ownedMissiles || {})
        },

        ownedDefense: {
          ...player.ownedDefense,
          ...(data.ownedDefense || {})
        },

        ownedVests: {
          ...player.ownedVests,
          ...(data.ownedVests || {})
        },

        ammo: {
          ...player.ammo,
          ...(data.ammo || {})
        },

        missileAmmo: {
          ...player.missileAmmo,
          ...(data.missileAmmo || {})
        }
      };
    }
  }
} catch (error) {
  console.log("Save reset:", error);
}


// ================================
// GAME DATA
// ================================

const guns = [
  {
    name: "AK-47",
    price: 0,
    ammoStart: 10,
    ammoPack: 10,
    ammoPrice: 150
  },

  {
    name: "M4",
    price: 700,
    ammoStart: 10,
    ammoPack: 10,
    ammoPrice: 200
  },

  {
    name: "G36",
    price: 1000,
    ammoStart: 10,
    ammoPack: 10,
    ammoPrice: 250
  },

  {
    name: "MP5",
    price: 1300,
    ammoStart: 10,
    ammoPack: 10,
    ammoPrice: 300
  },

  {
    name: "SCAR-L",
    price: 1700,
    ammoStart: 10,
    ammoPack: 10,
    ammoPrice: 350
  }
];


const missiles = [
  {
    name: "Scud-B",
    price: 0,
    start: 2,
    refill: 1,
    refillPrice: 500
  },

  {
    name: "Fateh-110",
    price: 1500,
    start: 2,
    refill: 1,
    refillPrice: 700
  },

  {
    name: "Patriot",
    price: 2200,
    start: 2,
    refill: 1,
    refillPrice: 900
  },

  {
    name: "Tomahawk",
    price: 3000,
    start: 2,
    refill: 1,
    refillPrice: 1100
  },

  {
    name: "Iskander",
    price: 4000,
    start: 2,
    refill: 1,
    refillPrice: 1300
  }
];


const defenses = [
  {
    value: 25,
    price: 0
  },

  {
    value: 35,
    price: 1000
  },

  {
    value: 45,
    price: 1800
  },

  {
    value: 55,
    price: 2800
  },

  {
    value: 65,
    price: 4000
  }
];


const vests = [
  {
    value: 25,
    price: 0
  },

  {
    value: 35,
    price: 800
  },

  {
    value: 45,
    price: 1500
  },

  {
    value: 55,
    price: 2400
  },

  {
    value: 65,
    price: 3500
  }
];


// ================================
// GAME VARIABLES
// ================================

let score = 0;
let gameXP = 0;
let gameHealth = 100;
let gameTime = 30;

let gameRunning = false;

let gameTimer = null;
let enemyTimer = null;


// ================================
// SAVE
// ================================

function savePlayer() {
  try {
    localStorage.setItem(
      "missileArenaPlayer",
      JSON.stringify(player)
    );
  } catch (error) {
    console.log("Could not save:", error);
  }
}


// ================================
// SAFE ELEMENT GETTER
// ================================

function el(id) {
  return document.getElementById(id);
}


// ================================
// SCREEN
// ================================

function showScreen(id) {

  document.querySelectorAll(".screen").forEach(function(screen) {
    screen.classList.remove("active");
  });

  const screen = el(id);

  if (screen) {
    screen.classList.add("active");
  }

  updateUI();
}


// ================================
// BACK TO MENU
// ================================

function backToMenu() {

  stopGame();

  showScreen("menu");
}


// ================================
// STOP GAME
// ================================

function stopGame() {

  gameRunning = false;

  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }

  if (enemyTimer) {
    clearInterval(enemyTimer);
    enemyTimer = null;
  }
}


// ================================
// UPDATE UI
// ================================

function updateUI() {

  if (el("money")) {
    el("money").textContent = player.money;
  }

  if (el("menuLevel")) {
    el("menuLevel").textContent = player.level;
  }

  if (el("menuXP")) {
    el("menuXP").textContent = player.xp;
  }

  if (el("menuMoney")) {
    el("menuMoney").textContent = player.money;
  }

  updateGameEquipment();
  updateProfile();
}


// ================================
// GAME EQUIPMENT
// ================================

function updateGameEquipment() {

  const gun = player.currentGun;
  const missile = player.currentMissile;

  if (el("gameGun")) {
    el("gameGun").textContent = gun;
  }

  if (el("gameAmmo")) {
    el("gameAmmo").textContent =
      player.ammo[gun] || 0;
  }

  if (el("gameMissile")) {
    el("gameMissile").textContent = missile;
  }

  if (el("gameMissileAmmo")) {
    el("gameMissileAmmo").textContent =
      player.missileAmmo[missile] || 0;
  }

  if (el("health")) {
    el("health").textContent = gameHealth;
  }

  if (el("score")) {
    el("score").textContent = score;
  }

  if (el("xp")) {
    el("xp").textContent = gameXP;
  }

  if (el("timer")) {
    el("timer").textContent = gameTime;
  }
}


// ================================
// PROFILE
// ================================

function updateProfile() {

  if (el("profileLevel")) {
    el("profileLevel").textContent =
      player.level;
  }

  if (el("profileXP")) {
    el("profileXP").textContent =
      player.xp;
  }

  if (el("profileMoney")) {
    el("profileMoney").textContent =
      player.money;
  }

  if (el("profileGun")) {
    el("profileGun").textContent =
      player.currentGun;
  }

  if (el("profileAmmo")) {
    el("profileAmmo").textContent =
      player.ammo[player.currentGun] || 0;
  }

  if (el("profileMissile")) {
    el("profileMissile").textContent =
      player.currentMissile;
  }

  if (el("profileMissileAmmo")) {
    el("profileMissileAmmo").textContent =
      player.missileAmmo[player.currentMissile] || 0;
  }

  if (el("profileDefense")) {
    el("profileDefense").textContent =
      player.currentDefense + "%";
  }

  if (el("profileVest")) {
    el("profileVest").textContent =
      player.currentVest + "%";
  }

  if (el("profileVestCurrent")) {
    el("profileVestCurrent").textContent =
      player.currentVestDurability + "%";
  }
}


// ================================
// PROFILE SCREEN
// ================================

function showProfile() {

  updateProfile();

  showScreen("profile");
}


// ================================
// SHOP SCREEN
// ================================

function showShop() {

  renderGuns();
  renderMissiles();
  renderDefense();
  renderVests();

  showScreen("shop");
}


// ================================
// GUN SHOP
// ================================

function renderGuns() {

  const container = el("gunsShop");

  if (!container) return;

  container.innerHTML = "";

  guns.forEach(function(gun) {

    const owned =
      !!player.ownedGuns[gun.name];

    const equipped =
      player.currentGun === gun.name;

    const ammo =
      player.ammo[gun.name] || 0;

    const item =
      document.createElement("div");

    item.className =
      "shop-item" +
      (equipped ? " equipped" : "");

    let buttons = "";

    if (!owned) {

      buttons = `
        <button onclick="buyGun('${gun.name}')">
          خرید
          ${gun.price === 0 ? "رایگان" : gun.price + " 💰"}
        </button>
      `;

    } else {

      buttons = `
        <button onclick="equipGun('${gun.name}')">
          ${equipped ? "✅ مجهز" : "مجهز کردن"}
        </button>

        <button onclick="buyGunAmmo('${gun.name}')">
          +${gun.ammoPack} مهمات
          <br>
          ${gun.ammoPrice} 💰
        </button>
      `;
    }

    item.innerHTML = `
      <div class="shop-item-top">
        <div class="shop-item-name">
          🔫 ${gun.name}
        </div>

        <div class="price">
          ${gun.price === 0
            ? "رایگان"
            : gun.price + " 💰"}
        </div>
      </div>

      <div class="shop-item-info">
        مهمات فعلی: ${ammo}
      </div>

      <div class="shop-buttons">
        ${buttons}
      </div>
    `;

    container.appendChild(item);
  });
}


// ================================
// BUY GUN
// ================================

function buyGun(name) {

  const gun =
    guns.find(function(g) {
      return g.name === name;
    });

  if (!gun) return;

  if (player.ownedGuns[name]) {

    equipGun(name);

    return;
  }

  if (player.money < gun.price) {

    alert("💰 پول کافی نداری!");

    return;
  }

  player.money -= gun.price;

  player.ownedGuns[name] = true;

  player.ammo[name] =
    gun.ammoStart;

  player.currentGun = name;

  savePlayer();

  renderGuns();
  updateUI();
}


// ================================
// EQUIP GUN
// ================================

function equipGun(name) {

  if (!player.ownedGuns[name]) {

    alert("اول این اسلحه را بخر.");

    return;
  }

  player.currentGun = name;

  savePlayer();

  renderGuns();
  updateUI();
}


// ================================
// BUY GUN AMMO
// ================================

function buyGunAmmo(name) {

  const gun =
    guns.find(function(g) {
      return g.name === name;
    });

  if (!gun) return;

  if (!player.ownedGuns[name]) {

    alert("اول اسلحه را بخر.");

    return;
  }

  if (player.money < gun.ammoPrice) {

    alert("💰 پول کافی نداری!");

    return;
  }

  player.money -= gun.ammoPrice;

  player.ammo[name] =
    (player.ammo[name] || 0) +
    gun.ammoPack;

  savePlayer();

  renderGuns();
  updateUI();
}


// ================================
// MISSILE SHOP
// ================================

function renderMissiles() {

  const container =
    el("missilesShop");

  if (!container) return;

  container.innerHTML = "";

  missiles.forEach(function(missile) {

    const owned =
      !!player.ownedMissiles[missile.name];

    const equipped =
      player.currentMissile === missile.name;

    const ammo =
      player.missileAmmo[missile.name] || 0;

    const item =
      document.createElement("div");

    item.className =
      "shop-item" +
      (equipped ? " equipped" : "");

    let buttons = "";

    if (!owned) {

      buttons = `
        <button onclick="buyMissile('${missile.name}')">
          خرید
          ${missile.price === 0
            ? "رایگان"
            : missile.price + " 💰"}
        </button>
      `;

    } else {

      buttons = `
        <button onclick="equipMissile('${missile.name}')">
          ${equipped ? "✅ مجهز" : "مجهز کردن"}
        </button>

        <button onclick="buyMissileAmmo('${missile.name}')">
          +1 🚀
          <br>
          ${missile.refillPrice} 💰
        </button>
      `;
    }

    item.innerHTML = `
      <div class="shop-item-top">
        <div class="shop-item-name">
          🚀 ${missile.name}
        </div>

        <div class="price">
          ${missile.price === 0
            ? "رایگان"
            : missile.price + " 💰"}
        </div>
      </div>

      <div class="shop-item-info">
        موشک باقی‌مانده: ${ammo}
      </div>

      <div class="shop-buttons">
        ${buttons}
      </div>
    `;

    container.appendChild(item);
  });
}


// ================================
// BUY MISSILE
// ================================

function buyMissile(name) {

  const missile =
    missiles.find(function(m) {
      return m.name === name;
    });

  if (!missile) return;

  if (player.ownedMissiles[name]) {

    equipMissile(name);

    return;
  }

  if (player.money < missile.price) {

    alert("💰 پول کافی نداری!");

    return;
  }

  player.money -= missile.price;

  player.ownedMissiles[name] = true;

  player.missileAmmo[name] =
    missile.start;

  player.currentMissile = name;

  savePlayer();

  renderMissiles();
  updateUI();
}


// ================================
// EQUIP MISSILE
// ================================

function equipMissile(name) {

  if (!player.ownedMissiles[name]) {

    alert("اول این موشک را بخر.");

    return;
  }

  player.currentMissile = name;

  savePlayer();

  renderMissiles();
  updateUI();
}


// ================================
// BUY MISSILE AMMO
// ================================

function buyMissileAmmo(name) {

  const missile =
    missiles.find(function(m) {
      return m.name === name;
    });

  if (!missile) return;

  if (!player.ownedMissiles[name]) {

    alert("اول موشک را بخر.");

    return;
  }

  if (player.money < missile.refillPrice) {

    alert("💰 پول کافی نداری!");

    return;
  }

  player.money -=
    missile.refillPrice;

  player.missileAmmo[name] =
    (player.missileAmmo[name] || 0) +
    missile.refill;

  savePlayer();

  renderMissiles();
  updateUI();
}


// ================================
// DEFENSE SHOP
// ================================

function renderDefense() {

  const container =
    el("defenseShop");

  if (!container) return;

  container.innerHTML = "";

  defenses.forEach(function(defense) {

    const owned =
      !!player.ownedDefense[defense.value];

    const equipped =
      player.currentDefense === defense.value;

    const item =
      document.createElement("div");

    item.className =
      "shop-item" +
      (equipped ? " equipped" : "");

    let button = "";

    if (owned) {

      button = `
        <button onclick="equipDefense(${defense.value})">
          ${equipped ? "✅ مجهز" : "مجهز کردن"}
        </button>
      `;

    } else {

      button = `
        <button onclick="buyDefense(${defense.value})">
          خرید
        </button>
      `;
    }

    item.innerHTML = `
      <div class="shop-item-top">
        <div class="shop-item-name">
          🛡️ دفاع ${defense.value}%
        </div>

        <div class="price">
          ${defense.price === 0
            ? "رایگان"
            : defense.price + " 💰"}
        </div>
      </div>

      <div class="shop-item-info">
        شانس دفاع: ${defense.value}%
      </div>

      <div class="shop-buttons">
        ${button}
      </div>
    `;

    container.appendChild(item);
  });
}


// ================================
// BUY DEFENSE
// ================================

function buyDefense(value) {

  const defense =
    defenses.find(function(d) {
      return d.value === value;
    });

  if (!defense) return;

  if (player.ownedDefense[value]) {

    equipDefense(value);

    return;
  }

  if (player.money < defense.price) {

    alert("💰 پول کافی نداری!");

    return;
  }

  player.money -= defense.price;

  player.ownedDefense[value] = true;

  player.currentDefense = value;

  savePlayer();

  renderDefense();
  updateUI();
}


// ================================
// EQUIP DEFENSE
// ================================

function equipDefense(value) {

  if (!player.ownedDefense[value]) return;

  player.currentDefense = value;

  savePlayer();

  renderDefense();
  updateUI();
}


// ================================
// VEST SHOP
// ================================

function renderVests() {

  const container =
    el("vestShop");

  if (!container) return;

  container.innerHTML = "";

  vests.forEach(function(vest) {

    const owned =
      !!player.ownedVests[vest.value];

    const equipped =
      player.currentVest === vest.value;

    const current =
      equipped
        ? player.currentVestDurability
        : vest.value;

    const item =
      document.createElement("div");

    item.className =
      "shop-item" +
      (equipped ? " equipped" : "");

    let buttons = "";

    if (!owned) {

      buttons = `
        <button onclick="buyVest(${vest.value})">
          خرید
          ${vest.price === 0
            ? "رایگان"
            : vest.price + " 💰"}
        </button>
      `;

    } else {

      buttons += `
        <button onclick="equipVest(${vest.value})">
          ${equipped ? "✅ مجهز" : "مجهز کردن"}
        </button>
      `;

      if (
        equipped &&
        player.currentVestDurability < vest.value
      ) {

        buttons += `
          <button onclick="repairVest()">
            🔧 تعمیر
          </button>
        `;
      }
    }

    item.innerHTML = `
      <div class="shop-item-top">
        <div class="shop-item-name">
          🦺 جلیقه ${vest.value}%
        </div>

        <div class="price">
          ${vest.price === 0
            ? "رایگان"
            : vest.price + " 💰"}
        </div>
      </div>

      <div class="shop-item-info">
        مقاومت فعلی: ${current}%
        <br>
        حداکثر مقاومت: ${vest.value}%
      </div>

      <div class="shop-buttons">
        ${buttons}
      </div>
    `;

    container.appendChild(item);
  });
}


// ================================
// BUY VEST
// ================================

function buyVest(value) {

  const vest =
    vests.find(function(v) {
      return v.value === value;
    });

  if (!vest) return;

  if (player.ownedVests[value]) {

    equipVest(value);

    return;
  }

  if (player.money < vest.price) {

    alert("💰 پول کافی نداری!");

    return;
  }

  player.money -= vest.price;

  player.ownedVests[value] = true;

  player.currentVest = value;

  player.currentVestDurability =
    value;

  savePlayer();

  renderVests();
  updateUI();
}


// ================================
// EQUIP VEST
// ================================

function equipVest(value) {

  if (!player.ownedVests[value]) return;

  player.currentVest = value;

  player.currentVestDurability =
    value;

  savePlayer();

  renderVests();
  updateUI();
}


// ================================
// REPAIR VEST
// ================================

function repairVest() {

  const max =
    player.currentVest;

  const current =
    player.currentVestDurability;

  if (current >= max) {

    alert("🦺 جلیقه کاملاً سالمه.");

    return;
  }

  const missing =
    max - current;

  const cost =
    Math.max(100, missing * 20);

  if (player.money < cost) {

    alert(
      "💰 برای تعمیر " +
      cost +
      " پول لازم داری."
    );

    return;
  }

  player.money -= cost;

  player.currentVestDurability =
    max;

  savePlayer();

  renderVests();
  updateUI();
}


// ================================
// START GAME
// ================================

function startGame() {

  stopGame();

  score = 0;
  gameXP = 0;
  gameHealth = 100;
  gameTime = 30;

  gameRunning = true;

  updateGameEquipment();

  showScreen("game");

  moveTarget();

  setMessage("🎯 هدف را بزن!");

  gameTimer = setInterval(function() {

    if (!gameRunning) return;

    gameTime--;

    updateGameEquipment();

    if (gameTime <= 0) {

      endGame();
    }

  }, 1000);


  enemyTimer = setInterval(function() {

    if (!gameRunning) return;

    enemyAttack();

  }, 3500);
}


// ================================
// TARGET MOVEMENT
// ================================

function moveTarget() {

  const target =
    el("target");

  const battle =
    document.querySelector(".battle");

  if (!target || !battle) return;

  const maxX =
    Math.max(0, battle.clientWidth - 75);

  const maxY =
    Math.max(0, battle.clientHeight - 75);

  const x =
    Math.random() * maxX;

  const y =
    Math.random() * maxY;

  target.style.left =
    x + "px";

  target.style.top =
    y + "px";
}


// ================================
// MESSAGE
// ================================

function setMessage(text) {

  cons
