/**
 * @fileoverview UIController manages the interaction between the user and the simulation.
 */

import { Logger } from '../utils/Logger.js';

const ALGO_INFO = {
    BFS: {
        name: 'Breadth First Search',
        complexity: 'O(V + E)',
        description: 'Explores the graph layer by layer, visiting all neighbors of a node before moving to the next level.',
        steps: [
            'Add starting node to a queue.',
            'While queue is not empty, dequeue a node.',
            'Visit all unvisited neighbors and add them to the queue.',
            'Repeat until all reachable nodes are visited.'
        ]
    },
    DFS: {
        name: 'Depth First Search',
        complexity: 'O(V + E)',
        description: 'Explores as far as possible along each branch before backtracking.',
        steps: [
            'Start at the root node and mark it as visited.',
            'Recursively visit each unvisited neighbor.',
            'Backtrack when no more unvisited neighbors exist.',
            'Repeat until all nodes in the branch are processed.'
        ]
    },
    DIJKSTRA: {
        name: "Dijkstra's Algorithm",
        complexity: 'O((V + E) log V)',
        description: 'Finds the shortest path between nodes in a graph with non-negative edge weights.',
        steps: [
            'Assign a distance of zero to the start node and infinity to others.',
            'Select the unvisited node with the smallest distance.',
            'For each neighbor, calculate the tentative distance through the current node.',
            'Update the distance if the new path is shorter.'
        ]
    },
    PRIM: {
        name: "Prim's Algorithm",
        complexity: 'O(E log V)',
        description: 'Finds the Minimum Spanning Tree (MST) for a weighted undirected graph.',
        steps: [
            'Start with an arbitrary node and add it to the MST.',
            'Find the cheapest edge connecting a node in the MST to one outside.',
            'Add that edge and node to the MST.',
            'Repeat until all nodes are included.'
        ]
    },
    GREEDY: {
        name: 'Huffman Coding (Greedy + HashMap)',
        complexity: 'O(n log n)',
        description: 'A greedy algorithm that builds an optimal prefix code. Character frequencies are stored in a HashMap, then the two smallest nodes are repeatedly merged into a binary tree.',
        steps: [
            'Count the frequency of every character into a HashMap.',
            'Put every character into a min-heap keyed by frequency.',
            'Greedily merge the two smallest nodes; push the combined node back.',
            'Repeat until a single tree remains, then read the 0/1 codes from the tree.'
        ]
    },
    KNAPSACK: {
        name: '0/1 Knapsack (Dynamic Programming)',
        complexity: 'O(n·W)',
        description: 'Chooses a subset of items with maximum total value without exceeding the capacity. Uses a DP table where dp[i][w] is the best value using the first i items and capacity w.',
        steps: [
            'Initialize a table with rows for items and columns for capacities.',
            'For each item i and capacity w, decide take vs skip.',
            'Take only if the item fits and improves the value.',
            'Backtrack through the table to recover the chosen items.'
        ]
    }
};

const GRAPH_ALGOS = ['BFS', 'DFS', 'DIJKSTRA', 'PRIM'];

export class UIController {
    constructor(engine) {
        this.engine = engine;

        // State
        this.mode = 'node'; // 'node' or 'edge'
        this.selectedNode = null;
        this.activeAlgoKey = null;

        // UI Elements
        this.vizContainer = document.getElementById('vizContainer');
        this.svg = document.getElementById('graphSvg');
        this.nodeModeBtn = document.getElementById('nodeModeBtn');
        this.edgeModeBtn = document.getElementById('edgeModeBtn');
        this.editModeBtn = document.getElementById('editModeBtn');
        this.clearGraphBtn = document.getElementById('clearGraphBtn');
        this.startNodeSelect = document.getElementById('startNodeSelect');
        this.targetNodeSelect = document.getElementById('targetNodeSelect');
        this.edgeWeightInput = document.getElementById('edgeWeightInput');

        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.speedSlider = document.getElementById('speedSlider');
        this.algoItems = document.querySelectorAll('.algo-item');
        this.logContainer = document.getElementById('executionLog');
        this.stepCount = document.getElementById('stepCount');
        this.pathLength = document.getElementById('pathLength');
        this.pathLengthContainer = document.getElementById('pathLengthContainer');
        this.currentAlgoName = document.getElementById('currentAlgoName');
        this.statusMsg = document.getElementById('statusMsg');
        this.algoInfoContainer = document.getElementById('algoInfo');

        // Non-graph algorithm elements
        this.startNodeContainer = document.getElementById('startNodeContainer');
        this.editGraphPanel = document.getElementById('editGraphPanel');
        this.algoParamsPanel = document.getElementById('algoParamsPanel');
        this.huffmanParams = document.getElementById('huffmanParams');
        this.knapsackParams = document.getElementById('knapsackParams');
        this.huffmanInput = document.getElementById('huffmanInput');
        this.knapsackCapacity = document.getElementById('knapsackCapacity');
        this.knapsackItems = document.getElementById('knapsackItems');
        this.nodeCountContainer = document.getElementById('nodeCountContainer');

        this.setupListeners();
        this.setupEngineHooks();
    }

    /**
     * Returns true when the active algorithm is not graph-based.
     * @returns {boolean}
     */
    isNonGraphAlgo() {
        return this.activeAlgoKey === 'GREEDY' || this.activeAlgoKey === 'KNAPSACK';
    }

    /**
     * Shows/hides the UI panels depending on whether the selected algorithm
     * works on a graph or uses the parameters panel.
     * @param {string} algoKey
     */
    updateAlgoUI(algoKey) {
        const isGraph = GRAPH_ALGOS.includes(algoKey);

        this.editGraphPanel.style.display = isGraph ? 'block' : 'none';
        this.algoParamsPanel.style.display = isGraph ? 'none' : 'block';
        this.startNodeContainer.style.display = isGraph ? 'inline' : 'none';
        this.nodeCountContainer.style.display = isGraph ? 'inline' : 'none';

        this.huffmanParams.style.display = algoKey === 'GREEDY' ? 'block' : 'none';
        this.knapsackParams.style.display = algoKey === 'KNAPSACK' ? 'block' : 'none';
    }

    setupListeners() {
        // Mode Toggles
        this.nodeModeBtn.addEventListener('click', () => this.setMode('node'));
        this.edgeModeBtn.addEventListener('click', () => this.setMode('edge'));
        this.editModeBtn.addEventListener('click', () => this.setMode('edit'));
        this.clearGraphBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the entire graph?')) {
                this.dispatchEvent('clearGraph');
            }
        });

        // Canvas Clicks
        this.svg.addEventListener('click', (e) => this.handleCanvasClick(e));

        // Simulation Controls
        this.playBtn.addEventListener('click', () => {
            // Non-graph algorithms collect their inputs from the parameters panel
            if (this.isNonGraphAlgo()) {
                const params = this.collectParams();
                if (!params) return;
                this.dispatchEvent('startSimulation', { params });
                return;
            }

            const startNodeId = this.startNodeSelect.value;
            const targetNodeId = this.targetNodeSelect.value;
            if (!startNodeId) {
                alert('Please select a Start Node first.');
                return;
            }
            this.dispatchEvent('startSimulation', { startNodeId, targetNodeId });
        });
        this.pauseBtn.addEventListener('click', () => this.engine.pause());
        this.prevBtn.addEventListener('click', () => this.engine.prev());
        this.nextBtn.addEventListener('click', () => this.engine.next());
        this.resetBtn.addEventListener('click', () => this.engine.reset());

        this.speedSlider.addEventListener('input', (e) => {
            this.engine.setSpeed(parseInt(e.target.value));
        });

        this.algoItems.forEach(item => {
            item.addEventListener('click', () => {
                this.setActiveAlgo(item.dataset.algo);
            });
        });
    }

    setMode(mode) {
        this.mode = mode;
        this.selectedNode = null;
        this.nodeModeBtn.classList.toggle('active', mode === 'node');
        this.edgeModeBtn.classList.toggle('active', mode === 'edge');
        this.editModeBtn.classList.toggle('active', mode === 'edit');

        let msg = 'Click to place a node';
        if (mode === 'edge') msg = 'Click two nodes to connect them';
        if (mode === 'edit') msg = 'Click a node or edge to edit it';

        this.statusMsg.textContent = msg;
        this.dispatchEvent('modeChanged', { mode });
    }

    handleCanvasClick(e) {
        // Stop if we are playing simulation
        if (this.engine.isPlaying) return;

        // Get coordinates relative to SVG
        const rect = this.svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const nodeEl = e.target.closest('.node');
        const edgeGroup = e.target.closest('.edge-group');

        if (this.mode === 'edit') {
            if (nodeEl) {
                this.dispatchEvent('editNode', { nodeId: nodeEl.dataset.id });
            } else if (edgeGroup) {
                this.dispatchEvent('editEdge', { edgeId: edgeGroup.dataset.id });
            }
            return;
        }

        if (this.mode === 'node') {
            if (nodeEl) {
                // In node mode, clicking an existing node edits it (keeping existing behavior)
                this.dispatchEvent('editNode', { nodeId: nodeEl.dataset.id });
            } else {
                this.dispatchEvent('addNode', { x, y });
            }
        } else if (this.mode === 'edge') {
            if (nodeEl) {
                const nodeId = nodeEl.dataset.id;
                if (!this.selectedNode) {
                    this.selectedNode = nodeId;
                    this.dispatchEvent('nodeSelected', { nodeId });
                } else if (this.selectedNode === nodeId) {
                    this.selectedNode = null;
                    this.dispatchEvent('nodeDeselected', { nodeId });
                } else {
                    const weight = parseInt(this.edgeWeightInput.value) || 1;
                    this.dispatchEvent('addEdge', { sourceId: this.selectedNode, targetId: nodeId, weight });
                    this.selectedNode = null;
                }
            } else if (edgeGroup) {
                // Edit existing edge
                const edgeId = edgeGroup.dataset.id;
                this.dispatchEvent('editEdge', { edgeId });
            }
        }
    }

    updateNodeSelectors(nodes) {
        this.updateSelect(this.startNodeSelect, nodes);
        this.updateSelect(this.targetNodeSelect, nodes);
    }

    updateSelect(selectEl, nodes) {
        const currentVal = selectEl.value;
        selectEl.innerHTML = '<option value="">-</option>';
        nodes.forEach(node => {
            const opt = document.createElement('option');
            opt.value = node.id;
            opt.textContent = node.label;
            selectEl.appendChild(opt);
        });
        if (nodes.find(n => n.id === currentVal)) {
            selectEl.value = currentVal;
        }
    }

    showPathLength(length) {
        if (length > 0) {
            this.pathLength.textContent = length;
            this.pathLengthContainer.style.display = 'inline';
        } else {
            this.pathLengthContainer.style.display = 'none';
        }
    }

    /**
     * Reads and validates the parameters panel inputs for non-graph algorithms.
     * @returns {Object|null} Params object, or null if invalid.
     */
    collectParams() {
        if (this.activeAlgoKey === 'GREEDY') {
            const inputString = this.huffmanInput.value.trim();
            if (!inputString) {
                alert('Please enter a non-empty input string.');
                return null;
            }
            return { inputString };
        }

        if (this.activeAlgoKey === 'KNAPSACK') {
            const capacity = parseInt(this.knapsackCapacity.value, 10);
            if (isNaN(capacity) || capacity <= 0) {
                alert('Please enter a valid capacity (positive integer).');
                return null;
            }
            const items = this.parseItems(this.knapsackItems.value);
            if (!items) return null;
            return { capacity, items };
        }

        return null;
    }

    /**
     * Parses the items input of the form "weight:value,weight:value,...".
     * @param {string} raw
     * @returns {Array|null} List of items, or null if invalid.
     */
    parseItems(raw) {
        const parts = raw.split(',').map(s => s.trim()).filter(s => s.length > 0);
        if (parts.length === 0) {
            alert('Please enter at least one item in the form weight:value.');
            return null;
        }

        const items = [];
        for (let i = 0; i < parts.length; i++) {
            const [wStr, vStr] = parts[i].split(':').map(s => s.trim());
            const weight = parseInt(wStr, 10);
            const value = parseInt(vStr, 10);
            if (isNaN(weight) || isNaN(value) || weight <= 0) {
                alert(`Invalid item "${parts[i]}". Use the form weight:value (e.g. 2:3).`);
                return null;
            }
            items.push({ name: `Item ${i + 1}`, weight, value });
        }
        return items;
    }

    dispatchEvent(name, detail = {}) {
        const event = new CustomEvent(name, { detail });
        document.dispatchEvent(event);
    }

    setupEngineHooks() {
        this.engine.onStepChange = (index, step) => {
            this.stepCount.textContent = index + 1;
            this.addLogEntry(step.operation);
            this.statusMsg.textContent = step.operation;
        };

        this.engine.onPlaybackEnd = () => {
            this.addLogEntry('Execution finished.');
        };
    }

    setActiveAlgo(algoKey) {
        this.activeAlgoKey = algoKey;
        this.updateAlgoUI(algoKey);

        this.algoItems.forEach(i => i.classList.remove('active'));
        const active = Array.from(this.algoItems).find(i => i.dataset.algo === algoKey);
        if (active) {
            active.classList.add('active');
            this.currentAlgoName.textContent = active.querySelector('.label').textContent;
            this.updateAlgoInfo(algoKey);
        }

        // Dispatch event for app.js to handle algorithm switch
        const event = new CustomEvent('algoChanged', { detail: { algo: algoKey } });
        document.dispatchEvent(event);
    }

    updateAlgoInfo(algoKey) {
        const info = ALGO_INFO[algoKey];
        if (!info) return;

        this.algoInfoContainer.innerHTML = `
            <span class="info-title">${info.name}</span>
            <div class="info-complexity">
                <span>Time Complexity:</span>
                <span class="complexity-badge">${info.complexity}</span>
            </div>
            <p class="info-desc">${info.description}</p>
            <span class="info-steps-title">How it works:</span>
            <ul class="info-steps">
                ${info.steps.map(step => `<li>${step}</li>`).join('')}
            </ul>
        `;
    }

    addLogEntry(message) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `> ${message}`;
        this.logContainer.prepend(entry);
    }
}
