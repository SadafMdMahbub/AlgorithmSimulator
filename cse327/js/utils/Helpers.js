/**
 * @fileoverview General utility helper functions.
 */

export class Helpers {
    /**
     * Generates a unique ID.
     * @returns {string}
     */
    static generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Wait for a specified duration (promisified setTimeout).
     * @param {number} ms
     * @returns {Promise}
     */
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Deep clones an object.
     * @param {any} obj
     * @returns {any}
     */
    static clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}
