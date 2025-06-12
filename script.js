// script.js (Main Game Initialization)

// --- Global Game State ---
const Game = {
    // Player Stats (Initial Values)
    player: {
        hp: 100,
        maxHp: 100,
        armor: 200,
        maxArmor: 200,
        stamina: 200,
        maxStamina: 200,
        zPoints: 0,
        score: 0,
        currentWeapon: null, // Will hold a weapon object
        weapons: [], // Owned weapons
        potions: {
            health: 0,
            armor: 0
        },
        speed: 3 // pixels per frame
    },

    // House Stats
    house: {
        hp: 1000,
        maxHp: 1000
    },

    // Game State
    currentState: 'MAIN_MENU', // Can be 'MAIN_MENU', 'SETTINGS', 'PLAYING', 'SHOP', 'GAME_OVER', 'WAVE_COMPLETE'
    gameStarted: false,
    countdownTimer: 60, // 1 minute countdown
    wave: 0,
    enemies: [], // Array to hold active zombie entities
    bots: [],    // Array to hold active bot entities
    projectiles: [], // Array for bullets, rockets, grenades

    // DOM Elements Cache
    elements: {
        gameContainer: document.getElementById('game-container'),
        mainMenu: document.getElementById('main-menu'),
        settingsMenu: document.getElementById('settings-menu'),
        shopMenu: document.getElementById('shop-menu'),
        gameMessage: document.getElementById('game-message'),
        gameWorld: document.getElementById('game-world'),
        hud: document.getElementById('hud'),

        // HUD elements
        playerHpBar: document.getElementById('player-hp-bar').querySelector('.bar-fill'),
        playerArmorBar: document.getElementById('player-armor-bar').querySelector('.bar-fill'),
        playerStaminaBar: document.getElementById('player-stamina-bar').querySelector('.bar-fill'),
        countdownTimerDisplay: document.getElementById('countdown-timer'),
        zpointsDisplay: document.getElementById('zpoints-display'),
        scoreDisplay: document.getElementById('score-display'),
        waveDisplay: document.getElementById('wave-display'),
        openShopBtn: document.getElementById('open-shop-btn'),

        // Menu buttons
        startGameBtn: document.getElementById('start-game-btn'),
        settingsBtn: document.getElementById('settings-btn'),
        backToMainBtn: document.getElementById('back-to-main-btn'),
        shopCloseBtn: document.getElementById('shop-close-btn'),
        messageActionBtn: document.getElementById('message-action-btn')
    },

    // Game loop variables
    lastFrameTime: 0,
    deltaTime: 0, // Time in seconds since last frame
    gameLoopId: null
};

// --- Core Game Functions (Will be detailed in js/gameLoop.js, player.js, etc.) ---

// This function will update the UI based on player/game stats
// Defined in ui.js later, but called here for initial setup.
function updateHUD() {
    Game.elements.playerHpBar.style.width = `${(Game.player.hp / Game.player.maxHp) * 100}%`;
    Game.elements.playerArmorBar.style.width = `${(Game.player.armor / Game.player.maxArmor) * 100}%`;
    Game.elements.playerStaminaBar.style.width = `${(Game.player.stamina / Game.player.maxStamina) * 100}%`;
    Game.elements.countdownTimerDisplay.textContent = `00:${Game.countdownTimer.toString().padStart(2, '0')}`;
    Game.elements.zpointsDisplay.textContent = `ZPOINTS: ${Game.player.zPoints}`;
    Game.elements.scoreDisplay.textContent = `SCORE: ${Game.player.score}`;
    Game.elements.waveDisplay.textContent = `WAVE: ${Game.wave}`;
}

// Function to switch between game screens
function setScreen(screenName) {
    const screens = document.querySelectorAll('.game-screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    switch (screenName) {
        case 'MAIN_MENU':
            Game.elements.mainMenu.classList.add('active');
            Game.elements.hud.classList.add('hidden'); // Hide HUD in menus
            Game.elements.gameWorld.classList.add('hidden'); // Hide game world in menus
            break;
        case 'SETTINGS':
            Game.elements.settingsMenu.classList.add('active');
            Game.elements.hud.classList.add('hidden');
            Game.elements.gameWorld.classList.add('hidden');
            break;
        case 'SHOP':
            Game.elements.shopMenu.classList.add('active');
            Game.elements.hud.classList.add('hidden'); // Keep HUD hidden, maybe partially visible if needed later
            Game.elements.gameWorld.classList.add('hidden');
            break;
        case 'PLAYING':
            Game.elements.hud.classList.remove('hidden');
            Game.elements.gameWorld.classList.remove('hidden');
            // Hide all specific menu screens
            Game.elements.mainMenu.classList.remove('active');
            Game.elements.settingsMenu.classList.remove('active');
            Game.elements.shopMenu.classList.remove('active');
            Game.elements.gameMessage.classList.remove('active'); // Hide message screen
            break;
        case 'GAME_OVER':
        case 'WAVE_COMPLETE':
            Game.elements.gameMessage.classList.add('active');
            Game.elements.hud.classList.add('hidden'); // Optional: hide HUD on game over/wave complete
            break;
    }
    Game.currentState = screenName;
}

// --- Event Listeners ---
Game.elements.startGameBtn.addEventListener('click', () => {
    // Reset game state for a new game
    Game.player.hp = Game.player.maxHp;
    Game.player.armor = Game.player.maxArmor;
    Game.player.stamina = Game.player.maxStamina;
    Game.player.zPoints = 0;
    Game.player.score = 0;
    Game.player.weapons = []; // Start with basic weapon
    Game.player.potions = { health: 0, armor: 0 };
    Game.house.hp = Game.house.maxHp;
    Game.countdownTimer = 60;
    Game.wave = 0; // Wave will increment to 1 on first start
    Game.enemies = [];
    Game.bots = [];
    Game.projectiles = [];

    updateHUD(); // Initial HUD update

    setScreen('PLAYING');
    startGameLoop(); // Start the main game loop
});

Game.elements.settingsBtn.addEventListener('click', () => {
    setScreen('SETTINGS');
});

Game.elements.backToMainBtn.addEventListener('click', () => {
    setScreen('MAIN_MENU');
});

Game.elements.openShopBtn.addEventListener('click', () => {
    // Temporarily pause game loop if needed
    // generateShopItems(); // This function will be in js/shop.js
    setScreen('SHOP');
});

Game.elements.shopCloseBtn.addEventListener('click', () => {
    setScreen('PLAYING');
    // Resume game loop if paused
});

// --- Game Loop Function (placeholder, will be in js/gameLoop.js) ---
function gameLoop(currentTime) {
    if (Game.currentState !== 'PLAYING') {
        Game.gameLoopId = requestAnimationFrame(gameLoop); // Keep loop running for menus
        return;
    }

    Game.deltaTime = (currentTime - Game.lastFrameTime) / 1000; // Convert ms to seconds
    Game.lastFrameTime = currentTime;

    // --- Core Game Logic ---
    // 1. Update Player (movement, stamina, actions) - in player.js
    // 2. Update Enemies (movement, attacks) - in enemy.js
    // 3. Update Bots (AI, movement, attacks, loot) - in botAI.js
    // 4. Update Projectiles (movement, collision) - in weapons.js
    // 5. Collision Detection (player-enemy, projectile-enemy, enemy-house, bot-enemy)
    // 6. Apply Damage & Health Updates
    // 7. Manage Countdown Timer
    // 8. Manage Wave System (spawn enemies, check wave completion)
    // 9. Update HUD - in ui.js

    // Example: Basic countdown
    // if (Math.floor(currentTime / 1000) > Math.floor(Game.lastFrameTime / 1000)) { // Every second
    //     Game.countdownTimer--;
    //     if (Game.countdownTimer < 0) Game.countdownTimer = 0; // Prevents negative
    // }

    updateHUD(); // Always update HUD

    Game.gameLoopId = requestAnimationFrame(gameLoop);
}

function startGameLoop() {
    if (!Game.gameStarted) {
        Game.gameStarted = true;
        Game.lastFrameTime = performance.now(); // Initialize last frame time
        Game.gameLoopId = requestAnimationFrame(gameLoop);
        // Start first wave or initial countdown
        // startWave(1); // Call a wave management function later
    }
}

function stopGameLoop() {
    if (Game.gameStarted) {
        cancelAnimationFrame(Game.gameLoopId);
        Game.gameStarted = false;
    }
}

// --- Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
    setScreen('MAIN_MENU'); // Start on the main menu
    updateHUD(); // Render initial HUD (even if hidden)
    startGameLoop(); // Start the loop to handle menu transitions
    // Load saved score from localStorage here in utils.js
    // let savedScore = getSavedScore();
    // Game.player.score = savedScore;
});

// Placeholder for key presses (will be expanded in player.js)
document.addEventListener('keydown', (e) => {
    if (e.key === 's' || e.key === 'S') {
        if (Game.currentState === 'PLAYING') {
            setScreen('SHOP');
        } else if (Game.currentState === 'SHOP') {
            setScreen('PLAYING');
        }
    }
});
