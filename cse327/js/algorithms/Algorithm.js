/**
 * @fileoverview Base class for all graph algorithms.
 */

import { StepRecorder } from '../simulation/StepRecorder.js';

export class Algorithm {
    /**
     * @param {Graph} graph
     */
    constructor(graph) {
        this.graph = graph;
        this.recorder = new StepRecorder();
    }

    /**
     * Runs the algorithm and records steps.
     * To be implemented by subclasses.
     * @returns {Array} List of recorded steps.
     */
    run() {
        throw new Error('Algorithm.run() must be implemented by subclass');
    }

    /**
     * Resets the graph and recorder.
     */
    prepare() {
        this.graph.reset();
        this.recorder.clear();
    }

    /**
     * Backtracks from a target node to find the path sequence.
     * @param {string} targetNodeId
     * @returns {Object}
     */
    calculatePath(targetNodeId) {
        const nodes = [];
        const edges = [];
        let length = 0;

        let current = this.graph.nodes.get(targetNodeId);
        if (!current || (current.distance === Infinity && !current.visited)) {
            return { nodes: [], edges: [], length: 0 };
        }

        while (current) {
            nodes.push(current);
            if (current.parent) {
                const neighbors = this.graph.getNeighbors(current.id);
                const edge = neighbors.find(n => n.node.id === current.parent.id)?.edge;
                if (edge) {
                    edges.push(edge);
                    length += edge.weight;
                }
            }
            current = current.parent;
        }

        return { nodes: nodes.reverse(), edges: edges.reverse(), length };
    }
}
