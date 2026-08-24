/**
 * @fileoverview Node class representing a vertex in the graph.
 */

import { Helpers } from '../utils/Helpers.js';

export class Node {
    /**
     * @param {string} label
     * @param {number} x
     * @param {number} y
     */
    constructor(label, x = 0, y = 0, description = '') {
        this.id = Helpers.generateId();
        this.label = label;
        this.x = x;
        this.y = y;
        this.description = description;

        // Logical state
        this.visited = false;
        this.discoveryTime = null;
        this.finishTime = null;
        this.distance = Infinity;
        this.parent = null;

        // UI/Visual state
        this.state = 'default'; // 'default', 'active', 'visited', 'mst'
    }

    /**
     * Resets the node's algorithm-specific state.
     */
    reset() {
        this.visited = false;
        this.discoveryTime = null;
        this.finishTime = null;
        this.distance = Infinity;
        this.parent = null;
        this.state = 'default';
    }

    /**
     * Updates the position of the node.
     * @param {number} x
     * @param {number} y
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}
