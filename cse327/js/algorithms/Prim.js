/**
 * @fileoverview Prim's Minimum Spanning Tree implementation.
 */

import { Algorithm } from './Algorithm.js';

export class Prim extends Algorithm {
    /**
     * @param {string} startNodeId
     * @param {string|null} targetNodeId (Ignored for MST, but accepted for consistency)
     * @returns {Array}
     */
    run(startNodeId, targetNodeId = null) {
        this.prepare();
        const startNode = this.graph.nodes.get(startNodeId);
        if (!startNode) return [];

        startNode.distance = 0;
        this.recorder.record(this.graph, `Starting Prim's from node ${startNode.label}`);

        const unvisited = new Set(this.graph.nodes.values());

        while (unvisited.size > 0) {
            let u = null;
            let minDistance = Infinity;

            for (const node of unvisited) {
                if (node.distance < minDistance) {
                    minDistance = node.distance;
                    u = node;
                }
            }

            if (!u || u.distance === Infinity) break;

            unvisited.delete(u);
            u.state = 'active';

            if (u.parent) {
                const edge = this.graph.getEdgeBetween(u.id, u.parent.id);
                if (edge) {
                    edge.highlighted = true;
                }
            }

            this.recorder.record(this.graph, `Added ${u.label} to MST (edge weight: ${u.distance})`);
            u.state = 'mst';

            const neighbors = this.graph.getNeighbors(u.id);
            for (const { node: v, edge } of neighbors) {
                if (unvisited.has(v) && edge.weight < v.distance) {
                    // Visual feedback for relaxation/discovery
                    if (v.parent) {
                        const oldEdge = this.graph.getEdgeBetween(v.id, v.parent.id);
                        if (oldEdge) oldEdge.highlighted = false;
                    }

                    v.distance = edge.weight;
                    v.parent = u;

                    this.recorder.record(this.graph, `Found better connection to ${v.label} via ${u.label} (weight: ${edge.weight})`);
                }
            }
        }

        // Final Result Step: Mark all MST edges and nodes as 'path' (Green)
        this.graph.nodes.forEach(n => {
            if (n.state === 'mst') n.state = 'path';
        });
        this.graph.edges.forEach(e => {
            if (e.highlighted) e.state = 'path';
        });

        this.recorder.record(this.graph, "Prim's MST Complete. Result highlighted in green.");
        return this.recorder.getSteps();
    }
}
