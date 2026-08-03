/**
 * @fileoverview Dijkstra's Shortest Path implementation.
 */

import { Algorithm } from './Algorithm.js';

export class Dijkstra extends Algorithm {
    /**
     * @param {string} startNodeId
     * @param {string|null} targetNodeId
     * @returns {Array}
     */
    run(startNodeId, targetNodeId = null) {
        this.prepare();
        const startNode = this.graph.nodes.get(startNodeId);
        if (!startNode) return [];

        startNode.distance = 0;
        this.recorder.record(this.graph, `Initializing. Start node ${startNode.label} set to 0.`);

        const unvisited = new Set(this.graph.nodes.values());

        while (unvisited.size > 0) {
            // Find node with minimum distance
            let current = null;
            for (const node of unvisited) {
                if (!current || node.distance < current.distance) {
                    current = node;
                }
            }

            if (!current || current.distance === Infinity) break;

            unvisited.delete(current);
            current.state = 'active';

            // Highlight the path leading to this node
            if (current.parent) {
                const edge = this.graph.getEdgeBetween(current.id, current.parent.id);
                if (edge) edge.highlighted = true;
            }

            this.recorder.record(this.graph, `Extracted ${current.label} with distance ${current.distance}`);

            if (targetNodeId && current.id === targetNodeId) {
                current.state = 'visited';
                this.recorder.record(this.graph, `Target node ${current.label} reached!`);
                break;
            }

            const neighbors = this.graph.getNeighbors(current.id);
            for (const { node: v, edge } of neighbors) {
                if (unvisited.has(v)) {
                    const alt = current.distance + edge.weight;
                    if (alt < v.distance) {
                        // Un-highlight old parent edge if it exists
                        if (v.parent) {
                            const oldEdge = this.graph.getEdgeBetween(v.id, v.parent.id);
                            if (oldEdge) oldEdge.highlighted = false;
                        }

                        v.distance = alt;
                        v.parent = current;

                        // Temporarily highlight to show discovery
                        edge.highlighted = true;
                        this.recorder.record(this.graph, `Relaxing ${current.label}->${v.label}: new distance ${alt}`);
                    }
                }
            }

            current.state = 'visited';
        }

        this.recorder.record(this.graph, 'Dijkstra execution finished.');
        return this.recorder.getSteps();
    }
}
