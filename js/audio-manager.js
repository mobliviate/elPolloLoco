/**
 * Manages music and sound effects for the game with a global mute state
 * persisted in LocalStorage.
 * @class
 */
class AudioManager {
    /**
     * Creates the audio manager, loads state and preloads tracks.
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
     * Loads all audio assets used by the game.
     * @returns {void}
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
     * Adds a track to the manager.
     * @param {string} name - Logical track name.
     * @param {string} src - Source URL for audio file.
     * @param {boolean} [loop=false] - Whether to loop the track.
     * @returns {void}
     */
    add(name, src, loop) {
        const audio = new Audio(src);
        audio.loop = !!loop;
        audio.volume = 1;
        this.tracks[name] = audio;
    }

    /**
     * Plays a one-shot sound by name from the beginning.
     * @param {string} name - Track key to play.
     * @returns {void}
     */
    play(name) {
        if (this.muted) return;
        if (!this.tracks[name]) return;
        this.tracks[name].currentTime = 0;
        this.tracks[name].play();
    }

    /**
     * Plays a looping track by name if not muted.
     * @param {string} name - Track key to play.
     * @returns {void}
     */
    playLoop(name) {
        if (this.muted) return;
        if (!this.tracks[name]) return;
        this.tracks[name].play();
    }

    /**
     * Pauses all tracks or resumes looping ones depending on the flag.
     * @param {boolean} pause - True to pause everything, false to resume loops.
     * @returns {void}
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
     * Toggles the global mute state and persists it.
     * @returns {void}
     */
    toggleMute() {
        this.muted = !this.muted;
        this.applyMute();
        this.saveMuteState();
    }

    /**
     * Returns the current mute state.
     * @returns {boolean} True if muted.
     */
    isMuted() {
        return this.muted;
    }

    /**
     * Applies the mute flag to all managed tracks.
     * @returns {void}
     */
    applyMute() {
        for (let key in this.tracks) {
            this.tracks[key].muted = this.muted;
        }
    }

    /**
     * Loads the mute state from LocalStorage and applies it.
     * @returns {void}
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
     * Saves the current mute state into LocalStorage.
     * @returns {void}
     */
    saveMuteState() {
        localStorage.setItem(this.storageKey, this.muted ? 'true' : 'false');
    }
}

let audioManager = new AudioManager();