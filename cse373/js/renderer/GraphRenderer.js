/**
 * @fileoverview GraphRenderer handles drawing the graph state using SVG.
 */

import { COLORS, DIMENSIONS } from '../utils/Constants.js';

export class GraphRenderer {
    /**
     * @param {string} svgId
     */
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.ns = "http://www.w3.org/2000/svg";

        // Layers for proper z-index (edges below nodes)
        this.edgeLayer = document.createElementNS(this.ns, "g");
        this.nodeLayer = document.createElementNS(this.ns, "g");
        this.svg.appendChild(this.edgeLayer);
        this.svg.appendChild(this.nodeLayer);
    }

    /**
     * Renders a specific step snapshot.
     * @param {Object} step
     */
    renderStep(step) {
        this.clear();

        // 1. Draw Edges
        step.edges.forEach(edgeData => {
            const source = step.nodes.find(n => n.id === edgeData.sourceId);
            const target = step.nodes.find(n => n.id === edgeData.targetId);

            if (source && target) {
                this.drawEdge(source, target, edgeData.highlighted, edgeData.weight, edgeData.state === 'path', edgeData.id);
            }
        });

        // 2. Draw Nodes
        step.nodes.forEach(nodeData => {
            this.drawNode(nodeData);
        });
    }

    /**
     * Renders the current state of a Graph model.
     * @param {Graph} graph
     * @param {string|null} selectedNodeId
     */
    renderGraph(graph, selectedNodeId = null) {
        this.clear();

        graph.edges.forEach(edge => {
            this.drawEdge(edge.source, edge.target, edge.highlighted, edge.weight, edge.state === 'path', edge.id);
        });

        graph.nodes.forEach(node => {
            const nodeData = {
                id: node.id,
                label: node.label,
                x: node.x,
                y: node.y,
                state: node.id === selectedNodeId ? 'active' : node.state
            };
            this.drawNode(nodeData);
        });
    }

    drawNode(node) {
        const group = document.createElementNS(this.ns, "g");
        group.setAttribute("class", `node ${node.state}`);
        group.setAttribute("transform", `translate(${node.x}, ${node.y})`);
        group.setAttribute("data-id", node.id); // Store ID for interaction

        const circle = document.createElementNS(this.ns, "circle");
        circle.setAttribute("r", DIMENSIONS.NODE_RADIUS);

        // Apply color based on state
        let stroke = COLORS.NODE_BORDER;
        let fill = COLORS.NODE_DEFAULT;

        if (node.state === 'active') { stroke = COLORS.NODE_ACTIVE; fill = '#d1fae5'; }
        else if (node.state === 'visited') { stroke = COLORS.NODE_VISITED; fill = '#fef3c7'; }
        else if (node.state === 'mst') { stroke = COLORS.NODE_MST; fill = '#ede9fe'; }
        else if (node.state === 'path') { stroke = COLORS.NODE_PATH; fill = '#dcfce7'; }

        circle.setAttribute("stroke", stroke);
        circle.setAttribute("fill", fill);
        group.appendChild(circle);

        const text = document.createElementNS(this.ns, "text");
        text.textContent = node.label;
        group.appendChild(text);

        this.nodeLayer.appendChild(group);
    }

    drawEdge(source, target, highlighted, weight = null, isPath = false, id = null) {
        const group = document.createElementNS(this.ns, "g");
        group.setAttribute("class", "edge-group");
        if (id) group.setAttribute("data-id", id);
        group.setAttribute("style", "cursor: pointer; pointer-events: stroke;");
        this.edgeLayer.appendChild(group);

        const line = document.createElementNS(this.ns, "line");
        line.setAttribute("x1", source.x);
        line.setAttribute("y1", source.y);
        line.setAttribute("x2", target.x);
        line.setAttribute("y2", target.y);

        let stroke = COLORS.EDGE_DEFAULT;
        let width = DIMENSIONS.EDGE_WIDTH;
        let className = "edge";

        if (isPath) {
            stroke = COLORS.EDGE_PATH;
            width = DIMENSIONS.EDGE_HIGHLIGHT_WIDTH + 1;
            className = "edge path";
        } else if (highlighted) {
            stroke = COLORS.EDGE_HIGHLIGHT;
            width = DIMENSIONS.EDGE_HIGHLIGHT_WIDTH;
            className = "edge highlight";
        }

        line.setAttribute("stroke", stroke);
        line.setAttribute("stroke-width", width);
        line.setAttribute("class", className);
        group.appendChild(line);

        if (weight !== null) {
            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;

            // Add a small background rectangle for text readability
            const rect = document.createElementNS(this.ns, "rect");
            rect.setAttribute("x", midX - 10);
            rect.setAttribute("y", midY - 14);
            rect.setAttribute("width", 20);
            rect.setAttribute("height", 16);
            rect.setAttribute("fill", "white");
            rect.setAttribute("fill-opacity", "0.9");
            rect.setAttribute("rx", "4");
            group.appendChild(rect);

            const text = document.createElementNS(this.ns, "text");
            text.setAttribute("x", midX);
            text.setAttribute("y", midY - 2);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("style", "font-size: 11px; font-weight: 700; fill: #475569; pointer-events: none;");
            text.textContent = weight;
            group.appendChild(text);
        }
    }

    clear() {
        this.nodeLayer.innerHTML = '';
        this.edgeLayer.innerHTML = '';
    }
}
