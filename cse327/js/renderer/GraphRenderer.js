/**
 * @fileoverview GraphRenderer handles drawing the graph state using SVG for CSE327.
 */

import { COLORS, DIMENSIONS } from '../utils/Constants.js';

export class GraphRenderer {
    /**
     * @param {string} svgId
     */
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.ns = "http://www.w3.org/2000/svg";

        // Add Arrow Marker Definition
        const defs = document.createElementNS(this.ns, "defs");

        const marker = document.createElementNS(this.ns, "marker");
        marker.setAttribute("id", "arrowhead");
        marker.setAttribute("markerWidth", "10");
        marker.setAttribute("markerHeight", "7");
        marker.setAttribute("refX", "9");
        marker.setAttribute("refY", "3.5");
        marker.setAttribute("orient", "auto");
        const poly = document.createElementNS(this.ns, "polygon");
        poly.setAttribute("points", "0 0, 10 3.5, 0 7");
        poly.setAttribute("fill", "#cbd5e1");
        marker.appendChild(poly);
        defs.appendChild(marker);

        const markerStart = marker.cloneNode(true);
        markerStart.setAttribute("id", "arrowhead-start");
        markerStart.setAttribute("refX", "1");
        markerStart.querySelector("polygon").setAttribute("points", "10 0, 0 3.5, 10 7");
        defs.appendChild(markerStart);

        this.svg.appendChild(defs);

        // Layers for proper z-index
        this.groupLayer = document.createElementNS(this.ns, "g");
        this.edgeLayer = document.createElementNS(this.ns, "g");
        this.nodeLayer = document.createElementNS(this.ns, "g");

        this.svg.appendChild(this.groupLayer);
        this.svg.appendChild(this.edgeLayer);
        this.svg.appendChild(this.nodeLayer);
    }

    /**
     * Renders a specific step snapshot.
     */
    renderStep(step, graph = null) {
        this.clear();

        if (graph && graph.groups) {
            graph.groups.forEach(g => this.drawGroup(g));
        }

        step.edges.forEach(edgeData => {
            const source = step.nodes.find(n => n.id === edgeData.sourceId);
            const target = step.nodes.find(n => n.id === edgeData.targetId);

            if (source && target) {
                this.drawEdge(source, target, edgeData.highlighted, edgeData.weight, edgeData.state === 'path', edgeData.id, edgeData.bidirectional);
            }
        });

        step.nodes.forEach(nodeData => {
            this.drawNode({
                ...nodeData,
                customColor: nodeData.color,
                customStroke: nodeData.stroke
            });
        });
    }

    /**
     * Renders the current state of a Graph model.
     */
    renderGraph(graph, selectedNodeId = null) {
        this.clear();

        if (graph.groups) {
            graph.groups.forEach(g => this.drawGroup(g));
        }

        graph.edges.forEach(edge => {
            this.drawEdge(edge.source, edge.target, edge.highlighted, edge.weight, edge.state === 'path', edge.id, edge.bidirectional);
        });

        graph.nodes.forEach(node => {
            const nodeData = {
                id: node.id,
                label: node.label,
                x: node.x,
                y: node.y,
                state: node.id === selectedNodeId ? 'active' : node.state,
                isStacked: node.isStacked,
                customColor: node.color,
                customStroke: node.stroke
            };
            this.drawNode(nodeData);
        });
    }

    drawGroup(group) {
        const rect = document.createElementNS(this.ns, "rect");
        rect.setAttribute("x", group.x);
        rect.setAttribute("y", group.y);
        rect.setAttribute("width", group.width);
        rect.setAttribute("height", group.height);
        rect.setAttribute("fill", group.color || "#f0f9ff");
        rect.setAttribute("rx", "15");
        this.groupLayer.appendChild(rect);

        if (group.label) {
            const text = document.createElementNS(this.ns, "text");
            text.setAttribute("x", group.x + group.width/2);
            text.setAttribute("y", group.y - 15);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("style", "font-size: 14px; font-weight: 700; fill: #334155;");
            text.textContent = group.label;
            this.groupLayer.appendChild(text);
        }
    }

    drawNode(node) {
        const group = document.createElementNS(this.ns, "g");
        group.setAttribute("class", `node ${node.state}`);
        group.setAttribute("transform", `translate(${node.x}, ${node.y})`);
        group.setAttribute("data-id", node.id);

        let stroke = node.customStroke || "#0ea5e9";
        let fill = node.customColor || "white";

        if (node.state === 'active') { stroke = COLORS.NODE_ACTIVE; fill = '#d1fae5'; }
        else if (node.state === 'visited') { stroke = COLORS.NODE_VISITED; fill = '#fef3c7'; }
        else if (node.state === 'path') { stroke = COLORS.NODE_PATH; fill = '#dcfce7'; }

        const rect = document.createElementNS(this.ns, "rect");
        const width = 160;
        const height = 50;

        rect.setAttribute("x", -width/2);
        rect.setAttribute("y", -height/2);
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        rect.setAttribute("rx", "25");
        rect.setAttribute("ry", "25");

        if (node.isStacked) {
            for (let i = 1; i <= 2; i++) {
                const stack = document.createElementNS(this.ns, "rect");
                stack.setAttribute("x", -width/2 + (i*6));
                stack.setAttribute("y", -height/2 - (i*6));
                stack.setAttribute("width", width);
                stack.setAttribute("height", height);
                stack.setAttribute("rx", "25");
                stack.setAttribute("fill", "white");
                stack.setAttribute("stroke", stroke);
                stack.setAttribute("stroke-width", "1");
                stack.setAttribute("fill-opacity", "0.5");
                group.insertBefore(stack, rect);
            }
        }

        rect.setAttribute("style", "filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));");
        rect.setAttribute("stroke", stroke);
        rect.setAttribute("stroke-width", "2");
        rect.setAttribute("fill", fill);
        group.appendChild(rect);

        const text = document.createElementNS(this.ns, "text");
        text.setAttribute("style", "font-size: 11px; font-weight: 600; fill: #1e293b; pointer-events: none;");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "central");

        const words = node.label.split(' ');
        if (words.length > 2) {
            const tspan1 = document.createElementNS(this.ns, "tspan");
            tspan1.setAttribute("x", "0");
            tspan1.setAttribute("dy", "-0.2em");
            tspan1.textContent = words.slice(0, Math.ceil(words.length/2)).join(' ');
            const tspan2 = document.createElementNS(this.ns, "tspan");
            tspan2.setAttribute("x", "0");
            tspan2.setAttribute("dy", "1.2em");
            tspan2.textContent = words.slice(Math.ceil(words.length/2)).join(' ');
            text.appendChild(tspan1);
            text.appendChild(tspan2);
        } else {
            text.textContent = node.label;
        }

        group.appendChild(text);
        this.nodeLayer.appendChild(group);
    }

    drawEdge(source, target, highlighted, weight = null, isPath = false, id = null, bidirectional = false) {
        const group = document.createElementNS(this.ns, "g");
        group.setAttribute("class", "edge-group");
        if (id) group.setAttribute("data-id", id);
        this.edgeLayer.appendChild(group);

        const path = document.createElementNS(this.ns, "path");
        let d = "";
        const dx = target.x - source.x;
        const dy = target.y - source.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            d = `M ${source.x} ${source.y} L ${target.x} ${source.y} L ${target.x} ${target.y}`;
        } else {
            d = `M ${source.x} ${source.y} L ${source.x} ${target.y} L ${target.x} ${target.y}`;
        }

        const isFeedback = target.y < source.y && Math.abs(dx) < 100;
        if (isFeedback) {
             const yDiff = Math.abs(source.y - target.y);
             const lateralOffset = 100 + (yDiff * 0.15);
             d = `M ${source.x - 80} ${source.y} L ${source.x - lateralOffset} ${source.y} L ${source.x - lateralOffset} ${target.y} L ${target.x - 80} ${target.y}`;
        }

        path.setAttribute("d", d);
        path.setAttribute("fill", "none");

        let stroke = COLORS.EDGE_DEFAULT;
        let width = 1.5;
        if (isPath) { stroke = COLORS.EDGE_PATH; width = 3; }
        else if (highlighted) { stroke = COLORS.EDGE_HIGHLIGHT; width = 2.5; }

        path.setAttribute("stroke", stroke);
        path.setAttribute("stroke-width", width);
        path.setAttribute("marker-end", "url(#arrowhead)");
        if (bidirectional) path.setAttribute("marker-start", "url(#arrowhead-start)");

        group.appendChild(path);
    }

    clear() {
        this.nodeLayer.innerHTML = '';
        this.edgeLayer.innerHTML = '';
        this.groupLayer.innerHTML = '';
    }
}
