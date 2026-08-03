/**
 * @fileoverview Main entry point for the AlgoViz application.
 */

import { Graph } from './models/Graph.js';
import { GraphRenderer } from './renderer/GraphRenderer.js';
import { SimulationEngine } from './simulation/SimulationEngine.js';
import { UIController } from './ui/UIController.js';
import { BFS } from './algorithms/BFS.js';
import { DFS } from './algorithms/DFS.js';
import { Dijkstra } from './algorithms/Dijkstra.js';
import { Prim } from './algorithms/Prim.js';
import { SAMPLE_GRAPHS } from './data/SampleGraphs.js';
import { Logger } from './utils/Logger.js';

class App {
    constructor() {
        this.graph = new Graph();
        this.renderer = new GraphRenderer('graphSvg');
        this.engine = new SimulationEngine(this.renderer);
        this.ui = new UIController(this.engine);

        this.activeAlgoKey = null;
        this.selectedNodeId = null;

        this.init();
    }

    init() {
        Logger.info('Initializing AlgoViz App');
        this.loadSampleData();

        // Listen for UI events
        document.addEventListener('algoChanged', (e) => {
            this.activeAlgoKey = e.detail.algo;
            this.prepareSimulation();
        });

        document.addEventListener('startSimulation', (e) => {
            this.handleStartSimulation(e.detail.startNodeId, e.detail.targetNodeId);
        });

        document.addEventListener('addNode', (e) => this.handleAddNode(e.detail.x, e.detail.y));
        document.addEventListener('addEdge', (e) => this.handleAddEdge(e.detail.sourceId, e.detail.targetId, e.detail.weight));
        document.addEventListener('editNode', (e) => this.handleEditNode(e.detail.nodeId));
        document.addEventListener('editEdge', (e) => this.handleEditEdge(e.detail.edgeId));
        document.addEventListener('nodeSelected', (e) => this.handleNodeSelection(e.detail.nodeId));
        document.addEventListener('nodeDeselected', () => this.handleNodeSelection(null));
        document.addEventListener('clearGraph', () => this.handleClearGraph());
    }

    loadSampleData() {
        const data = SAMPLE_GRAPHS.DEFAULT;
        const nodeMap = [];

        data.nodes.forEach(n => {
            const node = this.graph.addNode(n.label, n.x, n.y);
            nodeMap.push(node.id);
        });

        data.edges.forEach(e => {
            this.graph.addEdge(nodeMap[e.source], nodeMap[e.target], e.weight);
        });

        this.updateView();
    }

    updateView() {
        this.renderer.renderGraph(this.graph, this.selectedNodeId);
        document.getElementById('nodeCount').textContent = this.graph.nodes.size;
        this.ui.updateNodeSelectors(Array.from(this.graph.nodes.values()));
    }

    handleAddNode(x, y) {
        const label = String.fromCharCode(65 + (this.graph.nodes.size % 26));
        const suffix = Math.floor(this.graph.nodes.size / 26);
        const finalLabel = suffix > 0 ? label + suffix : label;

        this.graph.addNode(finalLabel, x, y);
        this.updateView();
    }

    handleAddEdge(sourceId, targetId, weight) {
        this.graph.addEdge(sourceId, targetId, weight);
        this.selectedNodeId = null;
        this.updateView();
    }

    handleEditNode(nodeId) {
        const node = this.graph.nodes.get(nodeId);
        if (!node) return;

        const newLabel = window.prompt(`Enter new label for node ${node.label}:`, node.label);
        if (newLabel !== null && newLabel.trim() !== '') {
            this.graph.updateNodeLabel(nodeId, newLabel.trim());
            this.updateView();
        }
    }

    handleEditEdge(edgeId) {
        const edge = this.graph.edges.find(e => e.id === edgeId);
        if (!edge) return;

        const newWeight = window.prompt(`Enter new weight for edge ${edge.source.label}-${edge.target.label}:`, edge.weight);
        if (newWeight !== null && !isNaN(parseInt(newWeight))) {
            this.graph.updateEdgeWeight(edgeId, parseInt(newWeight));
            this.updateView();
        }
    }

    handleNodeSelection(nodeId) {
        this.selectedNodeId = nodeId;
        this.updateView();
    }

    handleClearGraph() {
        this.graph.clear();
        this.engine.pause();
        this.engine.setSteps([]);
        this.ui.showPathLength(0);
        this.updateView();
    }

    prepareSimulation() {
        if (!this.activeAlgoKey) return;
        this.graph.reset();
        this.ui.showPathLength(0);
        this.updateView();
    }

    handleStartSimulation(startNodeId, targetNodeId) {
        if (!this.activeAlgoKey) {
            alert('Please select an algorithm first.');
            return;
        }

        // 1. Reset state before starting
        this.graph.reset();
        this.ui.showPathLength(0);
        this.updateView();

        Logger.info(`Running simulation: ${this.activeAlgoKey} from ${startNodeId} to ${targetNodeId || 'all'}`);

        let algo;
        switch(this.activeAlgoKey) {
            case 'BFS': algo = new BFS(this.graph); break;
            case 'DFS': algo = new DFS(this.graph); break;
            case 'DIJKSTRA': algo = new Dijkstra(this.graph); break;
            case 'PRIM': algo = new Prim(this.graph); break;
            default: return;
        }

        const steps = algo.run(startNodeId, targetNodeId);

        // 2. If a target is selected, calculate the path from the algorithm's result
        if (targetNodeId && this.activeAlgoKey !== 'PRIM') {
            const pathResult = algo.calculatePath(targetNodeId);

            if (pathResult.nodes.length > 0) {
                // Create a clean snapshot for the final path visualization
                // We map the nodes and edges but override the state for path elements
                const pathNodeIds = new Set(pathResult.nodes.map(n => n.id));
                const pathEdgeIds = new Set(pathResult.edges.map(e => e.id));

                steps.push({
                    operation: `Shortest path to ${this.graph.nodes.get(targetNodeId).label} marked in green.`,
                    nodes: Array.from(this.graph.nodes.values()).map(n => ({
                        ...n,
                        state: pathNodeIds.has(n.id) ? 'path' : (n.visited ? 'visited' : 'default')
                    })),
                    edges: this.graph.edges.map(e => ({
                        ...e,
                        sourceId: e.source.id,
                        targetId: e.target.id,
                        state: pathEdgeIds.has(e.id) ? 'path' : (e.highlighted ? 'highlighted' : 'default')
                    })),
                    timestamp: Date.now(),
                    pathLength: pathResult.length
                });

                this.engine.onPlaybackEnd = () => {
                    this.ui.showPathLength(pathResult.length);
                    this.ui.addLogEntry(`Final shortest path length: ${pathResult.length}`);
                };
            }
        } else {
            this.ui.showPathLength(0);
        }

        this.engine.setSteps(steps);
        this.engine.play();
    }
}

// Start application
window.addEventListener('DOMContentLoaded', () => {
    new App();
});
