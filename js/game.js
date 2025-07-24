// js/game.js
/* global World, Keyboard, audioManager, setMuteButtonState, createLevel1 */

let canvas;
let world = null;
let keyboard = new Keyboard();
let currentLevel = null;

function boot() {
    canvas = document.getElementById('canvas');
    initUI();
    initKeyboardListeners();
    initMuteButtonFromStorage();
    checkOrientation();
}

function startGame() {
    if (world !== null) return;

    currentLevel = createLevel1();                 // Level erst jetzt erstellen
    world = new World(canvas, keyboard, currentLevel);
    audioManager.playLoop('bgm');
    hideStartScreen();
}

function restartGame() {
    if (world) world.gameOver = true;
    document.getElementById('endscreen').classList.add('hidden');
    world = null;
    currentLevel = null;
    startGame();
}

function goHome() {
    window.location.reload();
}

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

function togglePause() {
    if (!world) return;
    world.togglePause();
    audioManager.pauseAll(world.paused);
}

function updateLastInputTime() {
    if (!world || !world.character || !world.character[0]) return;
    world.character[0].markActive();
}

function toggleDebug() {
    window.DEBUG_MODE = !window.DEBUG_MODE;
}

function initMuteButtonFromStorage() {
    setMuteButtonState(audioManager.isMuted());
}

function hideStartScreen() {
    var ss = document.getElementById('start-screen');
    ss.classList.add('hidden');
}