/**
 * @fileoverview Breadth First Search implementation.
 */

import { Algorithm } from './Algorithm.js';

export class BFS extends Algorithm {
    /**
     * @param {string} startNodeId
     * @param {string|null} targetNodeId
     * @returns {Array}
     */
    run(startNodeId, targetNodeId = null) {
        this.prepare();
        const startNode = this.graph.nodes.get(startNodeId);
        if (!startNode) return [];

        const queue = [startNode];
        startNode.visited = true;
        startNode.state = 'active';
        this.recorder.record(this.graph, `Starting BFS from node ${startNode.label}`);

        while (queue.length > 0) {
            const current = queue.shift();
            current.state = 'active';
            this.recorder.record(this.graph, `Processing node ${current.label}`);

            if (targetNodeId && current.id === targetNodeId) {
                current.state = 'visited';
                this.recorder.record(this.graph, `Target node ${current.label} found!`);
                break;
            }

            const neighbors = this.graph.getNeighbors(current.id);
            for (const { node, edge } of neighbors) {
                if (!node.visited) {
                    node.visited = true;
                    node.parent = current;
                    node.state = 'active';
                    edge.highlighted = true;
                    this.recorder.record(this.graph, `Discovered ${node.label} from ${current.label}`);
                    queue.push(node);
                }
            }
            current.state = 'visited';
        }

        this.recorder.record(this.graph, 'BFS Execution Complete');
        return this.recorder.getSteps();
    }
}
