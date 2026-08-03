/**
 * @fileoverview Graph class managing nodes and edges.
 */

import { Node } from './Node.js';
import { Edge } from './Edge.js';
import { Logger } from '../utils/Logger.js';

export class Graph {
    constructor() {
        this.nodes = new Map(); // id -> Node
        this.edges = [];
        this.adjacencyList = new Map(); // nodeId -> [Edge]
    }

    /**
     * Adds a node to the graph.
     * @param {string} label
     * @param {number} x
     * @param {number} y
     * @returns {Node}
     */
    addNode(label, x, y) {
        const node = new Node(label, x, y);
        this.nodes.set(node.id, node);
        this.adjacencyList.set(node.id, []);
        Logger.debug(`Node added: ${label}`, node);
        return node;
    }

    /**
     * Adds an edge between two nodes.
     * @param {string} sourceId
     * @param {string} targetId
     * @param {number} weight
     * @param {boolean} directed
     * @returns {Edge|null}
     */
    addEdge(sourceId, targetId, weight = 1, directed = false) {
        const source = this.nodes.get(sourceId);
        const target = this.nodes.get(targetId);

        if (!source || !target) {
            Logger.error('Source or Target node not found', { sourceId, targetId });
            return null;
        }

        const edge = new Edge(source, target, weight, directed);
        this.edges.push(edge);
        this.adjacencyList.get(sourceId).push(edge);

        if (!directed) {
            // For undirected, add back-edge reference in adj list (pointing to same edge object)
            this.adjacencyList.get(targetId).push(edge);
        }

        Logger.debug(`Edge added: ${source.label} -> ${target.label}`);
        return edge;
    }

    /**
     * Gets all neighbor nodes for a given node.
     * @param {string} nodeId
     * @returns {Array<{node: Node, edge: Edge}>}
     */
    getNeighbors(nodeId) {
        const edges = this.adjacencyList.get(nodeId) || [];
        return edges.map(edge => ({
            node: edge.source.id === nodeId ? edge.target : edge.source,
            edge: edge
        }));
    }

    /**
     * Finds the edge object connecting two nodes.
     * @param {string} nodeId1
     * @param {string} nodeId2
     * @returns {Edge|null}
     */
    getEdgeBetween(nodeId1, nodeId2) {
        return this.edges.find(e =>
            (e.source.id === nodeId1 && e.target.id === nodeId2) ||
            (!e.directed && e.source.id === nodeId2 && e.target.id === nodeId1)
        ) || null;
    }

    /**
     * Resets all nodes and edges state for simulation.
     */
    reset() {
        this.nodes.forEach(node => node.reset());
        this.edges.forEach(edge => edge.reset());
    }

    /**
     * Updates the label of a node.
     * @param {string} nodeId
     * @param {string} newLabel
     */
    updateNodeLabel(nodeId, newLabel) {
        const node = this.nodes.get(nodeId);
        if (node) {
            node.label = newLabel;
            Logger.info(`Node ${nodeId} renamed to ${newLabel}`);
        }
    }

    /**
     * Updates the weight of an edge.
     * @param {string} edgeId
     * @param {number} newWeight
     */
    updateEdgeWeight(edgeId, newWeight) {
        const edge = this.edges.find(e => e.id === edgeId);
        if (edge) {
            edge.weight = newWeight;
            Logger.info(`Edge ${edgeId} weight updated to ${newWeight}`);
        }
    }

    /**
     * Clears all data from the graph.
     */
    clear() {
        this.nodes.clear();
        this.edges = [];
        this.adjacencyList.clear();
    }
}
