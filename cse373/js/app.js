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
import { Huffman } from './algorithms/Huffman.js';
import { Knapsack } from './algorithms/Knapsack.js';
import { TableRenderer } from './renderer/TableRenderer.js';
import { SAMPLE_GRAPHS } from './data/SampleGraphs.js';
import { Logger } from './utils/Logger.js';

class App {
    constructor() {
        this.graph = new Graph();
        this.graphRenderer = new GraphRenderer('graphSvg');
        this.tableRenderer = new TableRenderer('tableContainer');
        this.renderer = this.createCompositeRenderer();
        this.engine = new SimulationEngine(this.renderer);
        this.ui = new UIController(this.engine);

        this.activeAlgoKey = null;
        this.selectedNodeId = null;

        this.init();
    }

    /**
     * Builds a renderer that routes steps to the SVG graph renderer for graph
     * algorithms, or to the table renderer for non-graph algorithms.
     * @returns {Object}
     */
    createCompositeRenderer() {
        const graphSvgEl = document.getElementById('graphSvg');
        const tableContainerEl = document.getElementById('tableContainer');

        return {
            renderGraph: (graph, selectedNodeId) => {
                tableContainerEl.style.display = 'none';
                graphSvgEl.style.display = 'block';
                this.graphRenderer.renderGraph(graph, selectedNodeId);
            },
            renderStep: (step) => {
                const isTableStep = step && step.data && (step.data.kind === 'huffman' || step.data.kind === 'knapsack');
                const detailBox = document.getElementById('stepDetailBox');

                if (isTableStep) {
                    graphSvgEl.style.display = 'none';
                    tableContainerEl.style.display = 'block';
                    detailBox.style.display = 'none'; // TableRenderer has its own logic box
                    this.tableRenderer.renderStep(step);
                } else {
                    tableContainerEl.style.display = 'none';
                    graphSvgEl.style.display = 'block';
                    this.graphRenderer.renderStep(step);

                    // Show logic box for graph algorithms
                    if (step.operation) {
                        detailBox.style.display = 'block';
                        const op = step.operation.toLowerCase();
                        const isResult = op.includes('path') || op.includes('complete') || op.includes('result') || op.includes('found');
                        detailBox.className = isResult ? 'step-detail-box result' : 'step-detail-box';
                        detailBox.innerHTML = `<strong>Current Operation:</strong> ${step.operation}`;
                    } else {
                        detailBox.style.display = 'none';
                    }
                }
            },
            clear: () => {
                this.graphRenderer.clear();
                this.tableRenderer.clear();
                document.getElementById('stepDetailBox').style.display = 'none';
            },
            showTable: () => {
                graphSvgEl.style.display = 'none';
                tableContainerEl.style.display = 'block';
            }
        };
    }

    /**
     * Returns true when the algorithm is not graph-based (rendered as a table).
     * @param {string} algoKey
     * @returns {boolean}
     */
    isNonGraphAlgo(algoKey) {
        return algoKey === 'GREEDY' || algoKey === 'KNAPSACK';
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
            this.handleStartSimulation(e.detail);
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

        // Non-graph algorithms render into the table container
        if (this.isNonGraphAlgo(this.activeAlgoKey)) {
            this.renderer.showTable();
            this.tableRenderer.clear();
            return;
        }

        this.updateView();
    }

    handleStartSimulation(detail = {}) {
        const { startNodeId, targetNodeId, params } = detail;

        if (!this.activeAlgoKey) {
            alert('Please select an algorithm first.');
            return;
        }

        // 1. Reset state before starting
        this.graph.reset();
        this.ui.showPathLength(0);

        let steps;
        let algo;

        // Non-graph algorithms take their parameters from the UI panel
        if (this.activeAlgoKey === 'GREEDY') {
            Logger.info('Running simulation: GREEDY (Huffman Coding)');
            steps = new Huffman().run(params?.inputString || '');
        } else if (this.activeAlgoKey === 'KNAPSACK') {
            Logger.info('Running simulation: KNAPSACK (0/1 DP)');
            steps = new Knapsack().run(params?.capacity || 0, params?.items || []);
        } else {
            this.updateView();

            Logger.info(`Running simulation: ${this.activeAlgoKey} from ${startNodeId} to ${targetNodeId || 'all'}`);

            switch(this.activeAlgoKey) {
                case 'BFS': algo = new BFS(this.graph); break;
                case 'DFS': algo = new DFS(this.graph); break;
                case 'DIJKSTRA': algo = new Dijkstra(this.graph); break;
                case 'PRIM': algo = new Prim(this.graph); break;
                default: return;
            }

            steps = algo.run(startNodeId, targetNodeId);
        }

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
