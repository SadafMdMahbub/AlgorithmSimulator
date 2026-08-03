/**
 * @fileoverview SimulationEngine orchestrates the playback of algorithm steps.
 */

import { Logger } from '../utils/Logger.js';

export class SimulationEngine {
    constructor(renderer) {
        this.renderer = renderer;
        this.steps = [];
        this.currentIndex = -1;
        this.isPlaying = false;
        this.speed = 5; // 1 to 10
        this.timer = null;

        // Callbacks for UI updates
        this.onStepChange = null;
        this.onPlaybackEnd = null;
    }

    setSteps(steps) {
        this.steps = steps;
        this.currentIndex = steps.length > 0 ? 0 : -1;
        if (this.currentIndex !== -1) {
            this.renderer.renderStep(this.steps[this.currentIndex]);
        }
    }

    play() {
        if (this.isPlaying || this.steps.length === 0) return;
        if (this.currentIndex >= this.steps.length - 1) {
            this.currentIndex = 0; // Loop back or reset
        }

        this.isPlaying = true;
        this.run();
    }

    pause() {
        this.isPlaying = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    run() {
        if (!this.isPlaying) return;

        if (this.currentIndex < this.steps.length - 1) {
            this.next();
            const delay = this.calculateDelay();
            this.timer = setTimeout(() => this.run(), delay);
        } else {
            this.isPlaying = false;
            if (this.onPlaybackEnd) this.onPlaybackEnd();
        }
    }

    next() {
        if (this.currentIndex < this.steps.length - 1) {
            this.currentIndex++;
            this.renderer.renderStep(this.steps[this.currentIndex]);
            if (this.onStepChange) this.onStepChange(this.currentIndex, this.steps[this.currentIndex]);
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderer.renderStep(this.steps[this.currentIndex]);
            if (this.onStepChange) this.onStepChange(this.currentIndex, this.steps[this.currentIndex]);
        }
    }

    reset() {
        this.pause();
        this.currentIndex = this.steps.length > 0 ? 0 : -1;
        if (this.currentIndex !== -1) {
            this.renderer.renderStep(this.steps[this.currentIndex]);
        }
        if (this.onStepChange) this.onStepChange(this.currentIndex, this.steps[this.currentIndex]);
    }

    setSpeed(value) {
        this.speed = value;
    }

    calculateDelay() {
        // Speed 1 -> 2000ms, Speed 10 -> 100ms
        return 2100 - (this.speed * 200);
    }
}
