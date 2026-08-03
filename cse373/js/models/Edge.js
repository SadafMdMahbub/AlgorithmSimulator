/**
 * @fileoverview Edge class representing a connection between two nodes.
 */

import { Helpers } from '../utils/Helpers.js';

export class Edge {
    /**
     * @param {Node} source
     * @param {Node} target
     * @param {number} weight
     * @param {boolean} directed
     */
    constructor(source, target, weight = 1, directed = false) {
        this.id = Helpers.generateId();
        this.source = source;
        this.target = target;
        this.weight = weight;
        this.directed = directed;

        // UI/Visual state
        this.highlighted = false;
        this.state = 'default'; // 'default', 'highlighted', 'path'
    }

    /**
     * Resets the edge's visual state.
     */
    reset() {
        this.highlighted = false;
        this.state = 'default';
    }
}
