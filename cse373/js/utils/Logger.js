/**
 * @fileoverview Centralized logging utility.
 */

export class Logger {
    static level = 'info'; // 'debug', 'info', 'warn', 'error'

    static debug(msg, data) {
        if (this.level === 'debug') console.log(`[DEBUG] ${msg}`, data || '');
    }

    static info(msg, data) {
        console.log(`[INFO] ${msg}`, data || '');
    }

    static warn(msg, data) {
        console.warn(`[WARN] ${msg}`, data || '');
    }

    static error(msg, data) {
        console.error(`[ERROR] ${msg}`, data || '');
    }
}
