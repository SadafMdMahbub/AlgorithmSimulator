/**
 * @fileoverview UIController for CSE327 - Software Engineering Models.
 */

import { Logger } from '../utils/Logger.js';

const ALGO_INFO = {
    WATERFALL: {
        name: 'Waterfall Model',
        complexity: 'Linear / Plan-driven',
        description: 'A sequential process where each phase must be completed before the next begins. Ideal for projects with stable requirements.',
        steps: [
            'Requirements: Define and document user needs.',
            'Analysis: System and software requirements modeling.',
            'Design: Architecture, data structures, and interfaces.',
            'Coding: Implementation of the design in code.',
            'Testing: Verifying the system against requirements.',
            'Maintenance: Correcting errors and adapting to changes.'
        ]
    },
    INCREMENTAL_DEV: {
        name: 'Incremental Development',
        complexity: 'Iterative & Evolutionary',
        description: 'The software is developed as a series of increments, where each increment adds new functionality until the full system is complete.',
        steps: [
            'Gather the overall requirements.',
            'Divide the project into smaller modules (increments).',
            'Develop the first increment with the most important features.',
            'Test and deliver the first working version.',
            'Develop the next increment by adding more features.',
            'Repeat until the entire software is completed.'
        ]
    },
    EXTREME_PROG: {
        name: 'Extreme Programming (XP)',
        complexity: 'Agile / High Change',
        description: 'An agile methodology focusing on technical excellence, frequent releases, and continuous customer feedback.',
        steps: [
            'User Stories: Customers describe desired features.',
            'Release Planning: Decide which stories to implement.',
            'Small Releases: Frequent delivery of working software.',
            'Pair Programming: Two developers at one workstation.',
            'Test-First Development: Write tests before code.'
        ]
    }
};

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
        this.currentAlgoName = document.getElementById('currentAlgoName');
        this.statusMsg = document.getElementById('statusMsg');
        this.algoInfoContainer = document.getElementById('algoInfo');

        this.setupListeners();
        this.setupEngineHooks();
    }

    setupListeners() {
        // Mode Toggles
        this.nodeModeBtn.addEventListener('click', () => this.setMode('node'));
        this.edgeModeBtn.addEventListener('click', () => this.setMode('edge'));
        this.editModeBtn.addEventListener('click', () => this.setMode('edit'));
        this.clearGraphBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the entire process model?')) {
                this.dispatchEvent('clearGraph');
            }
        });

        // Canvas Clicks
        this.svg.addEventListener('click', (e) => this.handleCanvasClick(e));

        // Simulation Controls
        this.playBtn.addEventListener('click', () => {
            const startNodeId = this.startNodeSelect.value;
            const targetNodeId = this.targetNodeSelect.value;
            // No alert if empty, app.js will handle defaulting to the top node
            this.dispatchEvent('startSimulation', { startNodeId, targetNodeId });
        });
        this.pauseBtn.addEventListener('click', () => this.engine.pause());
        this.prevBtn.addEventListener('click', () => this.engine.prev());
        this.nextBtn.addEventListener('click', () => this.engine.next());
        this.resetBtn.addEventListener('click', () => this.engine.reset());

        const interruptBtn = document.getElementById('interruptBtn');
        if (interruptBtn) {
            interruptBtn.addEventListener('click', () => {
                const label = window.prompt('Enter Interrupt reason:', 'Change Request');
                if (label) this.dispatchEvent('addInterrupt', { label });
            });
        }

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

        let msg = 'Click to place a process phase';
        if (mode === 'edge') msg = 'Click two phases to connect them';
        if (mode === 'edit') msg = 'Click a phase or flow to edit it';

        this.statusMsg.textContent = msg;
        this.dispatchEvent('modeChanged', { mode });
    }

    handleCanvasClick(e) {
        if (this.engine.isPlaying) return;

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
                this.dispatchEvent('editEdge', { edgeId: edgeGroup.dataset.id });
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
        // Not using path length for SE models yet, but keeping for compatibility
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
            this.addLogEntry('Process model simulation complete.');
        };
    }

    setActiveAlgo(algoKey) {
        this.algoItems.forEach(i => i.classList.remove('active'));
        const active = Array.from(this.algoItems).find(i => i.dataset.algo === algoKey);
        if (active) {
            active.classList.add('active');
            this.currentAlgoName.textContent = active.querySelector('.label').textContent;
            this.updateAlgoInfo(algoKey);
        }
        const event = new CustomEvent('algoChanged', { detail: { algo: algoKey } });
        document.dispatchEvent(event);
    }

    updateAlgoInfo(algoKey) {
        const info = ALGO_INFO[algoKey];
        if (!info) return;

        this.algoInfoContainer.innerHTML = `
            <span class="info-title">${info.name}</span>
            <div class="info-complexity">
                <span>Characteristics:</span>
                <span class="complexity-badge">${info.complexity}</span>
            </div>
            <p class="info-desc">${info.description}</p>
            <span class="info-steps-title">Key Steps:</span>
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
