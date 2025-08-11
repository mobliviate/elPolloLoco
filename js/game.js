let canvas;
let world = null;
let keyboard = new Keyboard();
let currentLevel = null;

/* WICHTIG: window.world initialisieren, damit andere Dateien (mobile-controls.js)
   den Zustand sicher über window.world prüfen können. */
window.world = null;

/**
 * Bootstraps the application when the page loads.
 * Initializes UI, keyboard listeners, mute state and orientation check.
 * @returns {void}
 */
function boot() {
    canvas = document.getElementById('canvas');
    initUI();
    initKeyboardListeners();
    initMuteButtonFromStorage();
    checkOrientation();
}

/**
 * Starts the game exactly once and hides the start screen.
 * @returns {void}
 */
function startGame() {
    if (world !== null) { return; }
    currentLevel = createLevel1();
    world = new World(canvas, keyboard, currentLevel);
    window.world = world;                 // <-- attach to window
    audioManager.playLoop('bgm');
    hideStartScreen();
    updateMobileControlsVisibility();
}

/**
 * Restarts the game by resetting state and creating a new world.
 * @returns {void}
 */
function restartGame() {
    if (world) { world.gameOver = true; }
    document.getElementById('endscreen').classList.add('hidden');
    world = null;
    window.world = null;                  // <-- clean reset
    currentLevel = null;
    startGame();
    updateMobileControlsVisibility();
}

/**
 * Returns to the start page by reloading the document.
 * @returns {void}
 */
function goHome() {
    window.location.reload();
}

/**
 * Registers keydown/keyup handlers and maps them to keyboard state.
 * Also tracks last input time.
 * @returns {void}
 */
function initKeyboardListeners() {
    window.addEventListener('keydown', function (event) {
        switch (event.code) {
            case 'ArrowLeft': keyboard.LEFT = true; break;
            case 'ArrowRight': keyboard.RIGHT = true; break;
            case 'ArrowUp': keyboard.UP = true; break;
            case 'ArrowDown': keyboard.DOWN = true; break;
            case 'Space': keyboard.SPACE = true; break;
            case 'KeyD': keyboard.D = true; break;
            case 'KeyP': togglePause(); break;
            case 'F2': toggleDebug(); break;
        }
        updateLastInputTime();
    });

    window.addEventListener('keyup', function (event) {
        switch (event.code) {
            case 'ArrowLeft': keyboard.LEFT = false; break;
            case 'ArrowRight': keyboard.RIGHT = false; break;
            case 'ArrowUp': keyboard.UP = false; break;
            case 'ArrowDown': keyboard.DOWN = false; break;
            case 'Space': keyboard.SPACE = false; break;
            case 'KeyD': keyboard.D = false; break;
        }
    });
}

/**
 * Toggles world pause and syncs audio and mobile controls visibility.
 * @returns {void}
 */
function togglePause() {
    if (!world) { return; }
    world.togglePause();
    audioManager.pauseAll(world.paused);
    updateMobileControlsVisibility();     // <-- hide controls while paused
}

/**
 * Updates last input time on the character for idle/sleep logic.
 * @returns {void}
 */
function updateLastInputTime() {
    if (!world || !world.character || !world.character[0]) { return; }
    world.character[0].markActive();
}

/**
 * Toggles the debug overlay for hitboxes etc.
 * @returns {void}
 */
function toggleDebug() {
    window.DEBUG_MODE = !window.DEBUG_MODE;
}

/**
 * Restores mute button state based on stored preference.
 * @returns {void}
 */
function initMuteButtonFromStorage() {
    setMuteButtonState(audioManager.isMuted());
}

/**
 * Hides the start screen overlay.
 * @returns {void}
 */
function hideStartScreen() {
    let ss = document.getElementById('start-screen');
    ss.classList.add('hidden');
}