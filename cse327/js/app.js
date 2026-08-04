/**
 * @fileoverview Main entry point for CSE327 - Software Engineering Models.
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
        Logger.info('Initializing CSE327 Process Visualizer');
        this.loadSampleData('WATERFALL');

        // Listen for UI events
        document.addEventListener('algoChanged', (e) => {
            this.activeAlgoKey = e.detail.algo;
            this.handleModelSwitch(e.detail.algo);
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
        document.addEventListener('addInterrupt', (e) => this.handleAddInterrupt(e.detail.label));

        // Dragging Support
        this.isDragging = false;
        this.draggedNode = null;
        this.setupDragging();
    }

    setupDragging() {
        const svg = document.getElementById('graphSvg');

        svg.addEventListener('mousedown', (e) => {
            if (this.ui.mode !== 'edit') return;
            const nodeEl = e.target.closest('.node');
            if (nodeEl) {
                this.isDragging = true;
                this.draggedNode = this.graph.nodes.get(nodeEl.dataset.id);
                svg.style.cursor = 'grabbing';
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging || !this.draggedNode) return;
            const rect = svg.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.draggedNode.setPosition(x, y);
            this.updateView();
        });

        window.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.draggedNode = null;
                svg.style.cursor = 'default';
            }
        });
    }

    handleAddInterrupt(label) {
        const x = 500;
        const y = 250;
        const node = this.graph.addNode(`⚠️ ${label}`, x, y);
        node.color = '#fee2e2';
        node.stroke = '#ef4444';
        this.updateView();
    }

    handleModelSwitch(modelKey) {
        if (SAMPLE_GRAPHS[modelKey]) {
            this.loadSampleData(modelKey);
        } else {
            this.prepareSimulation();
        }
    }

    loadSampleData(modelKey = 'DEFAULT') {
        this.graph.clear();
        const data = SAMPLE_GRAPHS[modelKey] || SAMPLE_GRAPHS.DEFAULT;
        const nodeMap = [];

        data.nodes.forEach(n => {
            const node = this.graph.addNode(n.label, n.x, n.y, n.description);
            node.isStacked = n.isStacked;
            node.color = n.color;
            node.stroke = n.stroke;
            nodeMap.push(node.id);
        });

        data.edges.forEach(e => {
            const edge = this.graph.addEdge(nodeMap[e.source], nodeMap[e.target], e.weight);
            if (edge) edge.bidirectional = e.bidirectional;
        });

        this.updateView();
    }

    updateView() {
        this.renderer.renderGraph(this.graph, this.selectedNodeId);
        document.getElementById('nodeCount').textContent = this.graph.nodes.size;
        this.ui.updateNodeSelectors(Array.from(this.graph.nodes.values()));
    }

    handleAddNode(x, y) {
        const label = `Phase ${this.graph.nodes.size + 1}`;
        this.graph.addNode(label, x, y);
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
        const newLabel = window.prompt(`Enter name for this phase:`, node.label);
        if (newLabel !== null && newLabel.trim() !== '') {
            this.graph.updateNodeLabel(nodeId, newLabel.trim());
            this.updateView();
        }
    }

    handleEditEdge(edgeId) {
        const edge = this.graph.edges.find(e => e.id === edgeId);
        if (!edge) return;
        const newWeight = window.prompt(`Enter iteration count or weight:`, edge.weight);
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
        this.updateView();
    }

    prepareSimulation() {
        this.graph.reset();
        this.updateView();
    }

    handleStartSimulation(startNodeId, targetNodeId) {
        if (!startNodeId && this.graph.nodes.size > 0) {
            const nodesArr = Array.from(this.graph.nodes.values());
            nodesArr.sort((a, b) => a.y - b.y);
            startNodeId = nodesArr[0].id;
        }

        if (!startNodeId) {
            alert('No phases found to simulate.');
            return;
        }

        if (!this.activeAlgoKey) {
            this.activeAlgoKey = 'WATERFALL';
        }

        Logger.info(`Simulating process flow: ${this.activeAlgoKey}`);
        const steps = this.runProcessFlow(startNodeId, targetNodeId);

        this.engine.setSteps(steps, this.graph);
        this.engine.play();
    }

    runProcessFlow(startNodeId, targetNodeId) {
        this.graph.reset();
        const steps = [];
        const visited = new Set();
        const startNode = this.graph.nodes.get(startNodeId);

        if (!startNode) return [];
        const queue = [startNode];

        this.captureStep(steps, "Process started.");

        while (queue.length > 0) {
            const current = queue.shift();
            if (visited.has(current.id)) continue;
            visited.add(current.id);

            current.state = 'active';
            let op = `Entering phase: ${current.label}`;
            if (current.description) op += ` - ${current.description}`;
            this.captureStep(steps, op);

            if (targetNodeId && current.id === targetNodeId) {
                current.state = 'visited';
                this.captureStep(steps, `Target phase ${current.label} reached.`);
                break;
            }

            const neighbors = this.graph.getNeighbors(current.id);
            for (const { node, edge } of neighbors) {
                if (!visited.has(node.id)) {
                    edge.highlighted = true;
                    this.captureStep(steps, `Transitioning to ${node.label}...`);
                    queue.push(node);
                }
            }
            current.state = 'visited';
        }

        this.captureStep(steps, "Process simulation complete.");
        return steps;
    }

    captureStep(steps, operation) {
        steps.push({
            operation,
            nodes: Array.from(this.graph.nodes.values()).map(n => ({
                id: n.id, label: n.label, x: n.x, y: n.y, state: n.state, description: n.description, color: n.color, stroke: n.stroke, isStacked: n.isStacked
            })),
            edges: this.graph.edges.map(e => ({
                id: e.id, sourceId: e.source.id, targetId: e.target.id, highlighted: e.highlighted, bidirectional: e.bidirectional
            })),
            timestamp: Date.now()
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new App();
});
