/**
 * @fileoverview Depth First Search implementation.
 */

import { Algorithm } from './Algorithm.js';

export class DFS extends Algorithm {
    /**
     * @param {string} startNodeId
     * @param {string|null} targetNodeId
     * @returns {Array}
     */
    run(startNodeId, targetNodeId = null) {
        this.prepare();
        const startNode = this.graph.nodes.get(startNodeId);
        if (!startNode) return [];

        this.recorder.record(this.graph, `Starting DFS from node ${startNode.label}`);
        this.explore(startNode, targetNodeId);

        this.recorder.record(this.graph, 'DFS Execution Complete');
        return this.recorder.getSteps();
    }

    explore(node, targetNodeId) {
        node.visited = true;
        node.state = 'active';
        this.recorder.record(this.graph, `Visiting node ${node.label}`);

        if (targetNodeId && node.id === targetNodeId) {
            this.recorder.record(this.graph, `Target node ${node.label} reached!`);
            return true;
        }

        const neighbors = this.graph.getNeighbors(node.id);
        for (const { node: neighbor, edge } of neighbors) {
            if (!neighbor.visited) {
                neighbor.parent = node;
                edge.highlighted = true;
                this.recorder.record(this.graph, `Moving from ${node.label} to ${neighbor.label}`);

                const found = this.explore(neighbor, targetNodeId);
                if (found) return true;

                // After returning from recursion
                node.state = 'active';
                this.recorder.record(this.graph, `Backtracking to node ${node.label}`);
            }
        }

        node.state = 'visited';
        this.recorder.record(this.graph, `Finished node ${node.label}`);
        return false;
    }
}
