// js/audio-manager.js
/**
 * Handles all game audio (music & SFX) with global mute stored in LocalStorage.
 */
class AudioManager {
    /**
     * @constructor
     */
    constructor() {
        this.tracks = {};
        this.muted = false;
        this.storageKey = 'elpollo_mute';
        this.loadMuteState();
        this.loadAll();
    }

    /**
     * Loads all audio files.
     */
    loadAll() {
        this.add('bgm', 'audio/bgm.mp3', true);
        this.add('jump', 'audio/jump.mp3');
        this.add('hurt', 'audio/hurt.mp3');
        this.add('coin', 'audio/coin.mp3');
        this.add('bottle_throw', 'audio/bottle_throw.mp3');
        this.add('bottle_splash', 'audio/bottle_splash.mp3');
        this.add('enemy_hit', 'audio/enemy_hit.mp3');
        this.add('boss_hurt', 'audio/boss_hurt.mp3');
        this.add('snore', 'audio/snore.mp3');
    }

    /**
     * Adds a single track.
     * @param {string} name 
     * @param {string} src 
     * @param {boolean} loop 
     */
    add(name, src, loop) {
        const audio = new Audio(src);
        audio.loop = !!loop;
        audio.volume = 1;
        this.tracks[name] = audio;
    }

    /**
     * Plays a sound once.
     * @param {string} name 
     */
    play(name) {
        if (this.muted) return;
        if (!this.tracks[name]) return;
        this.tracks[name].currentTime = 0;
        this.tracks[name].play();
    }

    /**
     * Plays a looped track.
     * @param {string} name 
     */
    playLoop(name) {
        if (this.muted) return;
        if (!this.tracks[name]) return;
        this.tracks[name].play();
    }

    /**
     * Pauses or resumes all sounds.
     * @param {boolean} pause 
     */
    pauseAll(pause) {
        for (let key in this.tracks) {
            if (pause) {
                this.tracks[key].pause();
            } else if (!this.muted && this.tracks[key].loop) {
                this.tracks[key].play();
            }
        }
    }

    /**
     * Toggles mute state.
     */
    toggleMute() {
        this.muted = !this.muted;
        this.applyMute();
        this.saveMuteState();
    }

    /**
     * Returns current mute state.
     */
    isMuted() {
        return this.muted;
    }

    /**
     * Applies mute to all tracks.
     */
    applyMute() {
        for (let key in this.tracks) {
            this.tracks[key].muted = this.muted;
        }
    }

    /**
     * Load mute state from LocalStorage.
     */
    loadMuteState() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored === 'true') {
            this.muted = true;
        } else {
            this.muted = false;
        }
        this.applyMute();
    }

    /**
     * Save mute state to LocalStorage.
     */
    saveMuteState() {
        localStorage.setItem(this.storageKey, this.muted ? 'true' : 'false');
    }
}

let audioManager = new AudioManager();