/**
 * @fileoverview UIController manages the interaction between the user and the simulation.
 */

import { Logger } from '../utils/Logger.js';

export class UIController {
    constructor(engine) {
        this.engine = engine;

        // State
        this.mode = 'node'; // 'node' or 'edge'
        this.selectedNode = null;

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

        this.setupListeners();
        this.setupEngineHooks();
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
        this.algoItems.forEach(i => i.classList.remove('active'));
        const active = Array.from(this.algoItems).find(i => i.dataset.algo === algoKey);
        if (active) {
            active.classList.add('active');
            this.currentAlgoName.textContent = active.querySelector('.label').textContent;
        }

        // Dispatch event for app.js to handle algorithm switch
        const event = new CustomEvent('algoChanged', { detail: { algo: algoKey } });
        document.dispatchEvent(event);
    }

    addLogEntry(message) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `> ${message}`;
        this.logContainer.prepend(entry);
    }
}
