/**
 * @fileoverview StepRecorder captures snapshots of the graph state during algorithm execution.
 */

import { Helpers } from '../utils/Helpers.js';

export class StepRecorder {
    constructor() {
        this.steps = [];
    }

    /**
     * Records a snapshot of the current graph state.
     * @param {Graph} graph
     * @param {string} operation Description of what happened in this step.
     */
    record(graph, operation) {
        // Deep clone the state of nodes and edges
        const nodeSnapshots = Array.from(graph.nodes.values()).map(node => ({
            id: node.id,
            label: node.label,
            x: node.x,
            y: node.y,
            state: node.state, // Visual state
            distance: node.distance,
            visited: node.visited
        }));

        const edgeSnapshots = graph.edges.map(edge => ({
            id: edge.id,
            sourceId: edge.source.id,
            targetId: edge.target.id,
            highlighted: edge.highlighted,
            weight: edge.weight,
            state: edge.state
        }));

        this.steps.push({
            operation,
            nodes: nodeSnapshots,
            edges: edgeSnapshots,
            timestamp: Date.now()
        });
    }

    /**
     * Clears all recorded steps.
     */
    clear() {
        this.steps = [];
    }

    /**
     * Returns all recorded steps.
     * @returns {Array}
     */
    getSteps() {
        return this.steps;
    }
}
