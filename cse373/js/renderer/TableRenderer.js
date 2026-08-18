/**
 * @fileoverview TableRenderer renders non-graph algorithm steps (Huffman, Knapsack)
 * into an HTML container using tables, chips, and result boxes.
 */

export class TableRenderer {
    /**
     * @param {string} containerId
     */
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.ns = 'http://www.w3.org/2000/svg';
    }

    /**
     * Renders a specific step snapshot for a non-graph algorithm.
     * @param {Object} step
     */
    renderStep(step) {
        this.clear();
        if (!step || !step.data) return;

        const data = step.data;
        if (data.kind === 'knapsack') this.renderKnapsack(data);
        else if (data.kind === 'huffman') this.renderHuffman(data);

        // Keep the newest content visible when scrolling
        this.container.scrollTop = this.container.scrollHeight;
    }

    /**
     * Clears the container.
     */
    clear() {
        if (this.container) this.container.innerHTML = '';
    }

    // ——— 0/1 KNAPSACK ———

    renderKnapsack(data) {
        const { capacity, items, dp, phase, itemIndex, row, col, valA, valB, lookupA, lookupB, taken, selected, totalValue } = data;
        const html = [];

        html.push(`<div class="viz-section-title">0/1 Knapsack — Dynamic Programming Table</div>`);

        // Item legend
        html.push(`<div class="knap-legend">`);
        items.forEach((it, idx) => {
            const cls = idx === itemIndex ? 'knap-item-chip chip-active' : 'knap-item-chip';
            html.push(`<span class="${cls}">${it.name}: w=${it.weight}, v=${it.value}</span>`);
        });
        html.push(`</div>`);

        // 2D DP Table
        html.push(`<div class="sub-title">DP Table — best value dp[item][weight]</div>`);
        if (!dp || dp.length === 0) {
            html.push(`<span class="muted">(empty)</span>`);
        } else {
            html.push(`<table class="dp-table">`);

            // Header row (Capacity)
            html.push(`<tr><th>ITEM \\ W</th>`);
            for (let w = 0; w <= capacity; w++) {
                html.push(`<th>${w}</th>`);
            }
            html.push(`</tr>`);

            // Row for initial state (zero items)
            html.push(`<tr><th>—</th>`);
            for (let w = 0; w <= capacity; w++) {
                html.push(`<td>0</td>`);
            }
            html.push(`</tr>`);

            // Rows for each item
            for (let i = 1; i <= items.length; i++) {
                html.push(`<tr><th>${items[i-1].name} (${items[i-1].weight},${items[i-1].value})</th>`);
                for (let w = 0; w <= capacity; w++) {
                    const isTarget = phase === 'update' && i === row && w === col;
                    const isLookupA = phase === 'update' && lookupA && i === lookupA.r && w === lookupA.c;
                    const isLookupB = phase === 'update' && lookupB && i === lookupB.r && w === lookupB.c;
                    const isResult = phase === 'result' && i === items.length && w === capacity;

                    let cls = '';
                    if (isTarget || isResult) cls = 'cell-active';
                    else if (isLookupA || isLookupB) cls = 'cell-lookup';

                    html.push(`<td class="${cls}">${dp[i][w]}</td>`);
                }
                html.push(`</tr>`);
            }
            html.push(`</table>`);
        }

        // Detailed Step Logic Box
        if (phase === 'update' && itemIndex >= 0) {
            const item = items[itemIndex];
            html.push(`<div class="merge-note">`);
            html.push(`<strong>Step calculation for dp[${row}][${col}]:</strong><br/>`);

            if (item.weight > col) {
                html.push(`Formula: <code>dp[${row}][${col}] = dp[${row-1}][${col}]</code> (Item too heavy)<br/>`);
                html.push(`Values: <code>dp[${row}][${col}] = ${dp[row-1][col]}</code>`);
            } else {
                html.push(`Formula: <code>dp[${row}][${col}] = max(dp[${row-1}][${col}], dp[${row-1}][${col} - ${item.weight}] + ${item.value})</code><br/>`);
                html.push(`Values: <code>dp[${row}][${col}] = max(${valA}, ${valB}) = ${dp[row][col]}</code><br/>`);
                if (taken) html.push(`<span style="color:#047857; font-weight:bold;">→ ${item.name} TAKEN</span>`);
                else html.push(`<span style="color:#dc2626; font-weight:bold;">→ SKIPPED</span>`);
            }
            html.push(`</div>`);
        }

        // Final result: chosen items + total value
        if (phase === 'result') {
            html.push(`<div class="result-box">`);
            html.push(`<span class="result-label">Selected:</span> ${selected.map(it => `<span style="color: #dc2626; font-weight: bold;">${it.name}</span>`).join(', ') || '—'}`);
            html.push(`<span class="result-label">Total Value:</span> <strong>${totalValue}</strong>`);
            html.push(`</div>`);

            // Summary of counts
            const counts = {};
            items.forEach(it => counts[it.name] = 0);
            selected.forEach(it => counts[it.name]++);

            html.push(`<div class="merge-note" style="margin-top: 10px; background: #d1fae5; border-color: #6ee7b7; color: #065f46;">`);
            html.push(`<strong>Item Take Summary:</strong><br/>`);
            Object.entries(counts).forEach(([name, count]) => {
                html.push(`${name} taken ${count} time${count !== 1 ? 's' : ''}<br/>`);
            });
            html.push(`</div>`);
        }

        this.container.innerHTML = html.join('');
    }

    // ——— KNAPSACK ARROW OVERLAYS ———

    /**
     * Draws an arrow from the lookup cell (dp[w - weight]) into the cell
     * being updated (dp[w]), labeled with the item value being added.
     * @param {number} sourceIdx
     * @param {number} targetIdx
     * @param {number} value
     */
    drawKnapsackFlowArrow(sourceIdx, targetIdx, value) {
        const cells = this.container.querySelectorAll('.arr-cell');
        if (!cells.length || sourceIdx < 0 || targetIdx >= cells.length) return;

        const box = this.container.getBoundingClientRect();
        const source = cells[sourceIdx].getBoundingClientRect();
        const target = cells[targetIdx].getBoundingClientRect();

        const x1 = source.left - box.left + source.width / 2;
        const y1 = source.top - box.top + source.height / 2;
        const x2 = target.left - box.left + target.width / 2;
        const y2 = target.top - box.top + target.height / 2;

        const svg = this.createOverlaySvg();
        svg.appendChild(this.createArrowheadDef('knapArrowhead', '#ef4444'));

        const line = document.createElementNS(this.ns, 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('class', 'knap-flow-arrow');
        line.setAttribute('marker-end', 'url(#knapArrowhead)');
        svg.appendChild(line);

        const mx = (x1 + x2) / 2 + 8;
        const my = (y1 + y2) / 2 - 10;
        const text = document.createElementNS(this.ns, 'text');
        text.setAttribute('x', mx);
        text.setAttribute('y', my);
        text.setAttribute('class', 'knap-arrow-label');
        text.textContent = `+${value}`;
        svg.appendChild(text);

        this.container.appendChild(svg);
    }

    /**
     * Draws a dashed arrow under the array showing the right-to-left scan
     * direction for the current item.
     * @param {number} minIdx Leftmost cell the scan touches (the item's weight).
     * @param {number} maxIdx Rightmost cell (the capacity).
     */
    drawKnapsackScanArrow(minIdx, maxIdx) {
        const cells = this.container.querySelectorAll('.arr-cell');
        if (!cells.length || minIdx < 0 || maxIdx >= cells.length) return;

        const box = this.container.getBoundingClientRect();
        const leftCell = cells[minIdx].getBoundingClientRect();
        const rightCell = cells[maxIdx].getBoundingClientRect();

        const y = rightCell.bottom - box.top + 6;
        const x1 = rightCell.left - box.left + rightCell.width / 2;
        const x2 = leftCell.left - box.left + leftCell.width / 2;

        const svg = this.createOverlaySvg();
        svg.appendChild(this.createArrowheadDef('knapScanHead', '#94a3b8'));

        const line = document.createElementNS(this.ns, 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y);
        line.setAttribute('class', 'knap-scan-arrow');
        line.setAttribute('marker-end', 'url(#knapScanHead)');
        svg.appendChild(line);

        const text = document.createElementNS(this.ns, 'text');
        text.setAttribute('x', (x1 + x2) / 2);
        text.setAttribute('y', y - 6);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'knap-scan-label');
        text.textContent = 'scan right → left';
        svg.appendChild(text);

        this.container.appendChild(svg);
    }

    /**
     * Creates an absolutely-positioned overlay SVG covering the container.
     * @returns {SVGSVGElement}
     */
    createOverlaySvg() {
        const svg = document.createElementNS(this.ns, 'svg');
        svg.setAttribute('class', 'knap-arrow-overlay');
        svg.setAttribute('width', this.container.scrollWidth);
        svg.setAttribute('height', this.container.scrollHeight);
        svg.style.position = 'absolute';
        svg.style.left = '0';
        svg.style.top = '0';
        svg.style.pointerEvents = 'none';
        return svg;
    }

    /**
     * Builds an SVG marker definition for an arrowhead.
     * @param {string} id
     * @param {string} color
     * @returns {SVGDefsElement}
     */
    createArrowheadDef(id, color) {
        const defs = document.createElementNS(this.ns, 'defs');
        const marker = document.createElementNS(this.ns, 'marker');
        marker.setAttribute('id', id);
        marker.setAttribute('viewBox', '0 0 10 10');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '5');
        marker.setAttribute('markerWidth', '7');
        marker.setAttribute('markerHeight', '7');
        marker.setAttribute('orient', 'auto-start-reverse');
        const path = document.createElementNS(this.ns, 'path');
        path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
        path.setAttribute('fill', color);
        marker.appendChild(path);
        defs.appendChild(marker);
        return defs;
    }

    // ——— HUFFMAN CODING ———

    renderHuffman(data) {
        const { input, freqTable, heap, merged, codes, encoded, trees, highlightId, phase } = data;
        const html = [];

        html.push(`<div class="viz-section-title">Huffman Coding — Greedy + HashMap</div>`);
        html.push(`<div class="huff-input">Input: <code>"${input}"</code></div>`);

        // Frequency HashMap table
        html.push(`<div class="sub-title">Frequency HashMap</div>`);
        html.push(`<table class="mini-table">`);
        html.push(`<tr><th>Character</th><th>Frequency</th></tr>`);
        freqTable.forEach(f => html.push(`<tr><td><code>'${f.ch}'</code></td><td>${f.freq}</td></tr>`));
        html.push(`</table>`);

        // The Huffman tree grows with every greedy merge
        if (phase === 'merge' || phase === 'codes' || phase === 'result') {
            html.push(`<div class="sub-title">Huffman Tree</div>`);
            html.push(this.renderTree(trees, highlightId));
        }

        // Before any merges happen, show the initial heap of leaves
        if (phase === 'freq') {
            html.push(`<div class="sub-title">Heap (sorted by frequency)</div>`);
            html.push(`<div class="heap-row">`);
            heap.forEach(h => html.push(`<span class="heap-chip">${h.ch ? `'${h.ch}'` : '¤'} : ${h.freq}</span>`));
            html.push(`</div>`);
        }

        if (merged) {
            html.push(`<div class="merge-note">`);
            html.push(`<strong>Greedy Merge Step:</strong><br/>`);
            html.push(`Merging <span class="chip a">'${merged.a.ch ?? '¤'}' (${merged.a.freq})</span> + `);
            html.push(`<span class="chip b">'${merged.b.ch ?? '¤'}' (${merged.b.freq})</span> → `);
            html.push(`<span class="chip c">¤ (${merged.freq})</span><br/>`);
            html.push(`The two smallest frequencies are removed from the heap and merged into a new internal node.`);
            html.push(`</div>`);
        }

        if (phase === 'codes') {
            html.push(`<div class="merge-note" style="background: #e0e7ff; border-color: #c7d2fe; color: #3730a3;">`);
            html.push(`<strong>Generating Prefix Codes:</strong><br/>`);
            html.push(`Traversing the Huffman tree: left edge = '0', right edge = '1'.`);
            html.push(`</div>`);
        }

        // Prefix codes table
        if (codes) {
            html.push(`<div class="sub-title">Prefix Codes</div>`);
            html.push(`<table class="mini-table">`);
            html.push(`<tr><th>Character</th><th>Code</th></tr>`);
            Object.entries(codes).forEach(([ch, code]) => {
                html.push(`<tr><td><code>'${ch}'</code></td><td><code>${code}</code></td></tr>`);
            });
            html.push(`</table>`);
        }

        // Encoded result
        if (encoded) {
            html.push(`<div class="result-box" style="margin-bottom: 8px;">`);
            html.push(`<span class="result-label">Encoded:</span> <code class="encoded">${encoded}</code>`);
            html.push(`</div>`);

            // Summary box
            const originalBits = input.length * 8;
            const compression = ((1 - encoded.length / originalBits) * 100).toFixed(1);

            html.push(`<div class="merge-note" style="margin-top: 10px; background: #d1fae5; border-color: #6ee7b7; color: #065f46;">`);
            html.push(`<strong>Encoding Summary:</strong><br/>`);
            html.push(`Original Size: ${originalBits} bits (8 bits per char)<br/>`);
            html.push(`Compressed Size: ${encoded.length} bits<br/>`);
            html.push(`Compression Ratio: ${compression}% smaller`);
            html.push(`</div>`);
        }

        this.container.innerHTML = html.join('');
    }

    // ——— HUFFMAN TREE DRAWING ———

    /**
     * Lays out a serialized Huffman tree: leaves get consecutive x positions,
     * internal nodes sit centered between their children.
     * @param {Object} root
     * @returns {{nodes: Array, leafCount: number, maxDepth: number}}
     */
    layoutTree(root) {
        const nodes = [];
        let leafIdx = 0;
        let maxDepth = 0;

        const walk = (node, depth) => {
            if (!node) return null;
            maxDepth = Math.max(maxDepth, depth);

            let x;
            let leftId = null;
            let rightId = null;

            if (node.left || node.right) {
                leftId = walk(node.left, depth + 1);
                rightId = walk(node.right, depth + 1);
                const l = nodes.find(n => n.id === leftId);
                const r = nodes.find(n => n.id === rightId);
                x = (l.x + r.x) / 2;
            } else {
                x = leafIdx++;
            }

            nodes.push({ id: node.id, ch: node.ch, freq: node.freq, x, y: depth, leftId, rightId });
            return node.id;
        };

        walk(root, 0);
        return { nodes, leafCount: leafIdx, maxDepth };
    }

    /**
     * Builds an SVG string for the current forest of Huffman subtrees.
     * @param {Array|null} trees
     * @param {number|null} highlightId Id of the node merged in this step.
     * @returns {string}
     */
    renderTree(trees, highlightId) {
        if (!trees || trees.length === 0) return '';

        const H = 64;   // horizontal spacing per leaf
        const V = 92;   // vertical spacing per depth
        const R = 24;   // node radius
        const M = 28;   // outer margin

        const layouts = [];
        let totalLeaves = 0;
        let maxDepth = 0;

        trees.forEach(root => {
            const laid = this.layoutTree(root);
            layouts.push(laid);
            totalLeaves += laid.leafCount;
            maxDepth = Math.max(maxDepth, laid.maxDepth);
        });

        const width = Math.max(totalLeaves * H + M * 2, 200);
        const height = maxDepth * V + M * 2 + 24;

        const parts = [];
        parts.push(`<svg class="huff-tree" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`);

        let leafOffset = 0;
        layouts.forEach(laid => {
            const offset = leafOffset * H;
            leafOffset += laid.leafCount;

            // Edges first (below the nodes)
            laid.nodes.forEach(n => {
                if (n.leftId !== null) {
                    const l = laid.nodes.find(k => k.id === n.leftId);
                    parts.push(this.treeEdge(n.x * H + M + offset, n.y * V + M, l.x * H + M + offset, l.y * V + M, '0'));
                }
                if (n.rightId !== null) {
                    const r = laid.nodes.find(k => k.id === n.rightId);
                    parts.push(this.treeEdge(n.x * H + M + offset, n.y * V + M, r.x * H + M + offset, r.y * V + M, '1'));
                }
            });

            // Nodes on top
            laid.nodes.forEach(n => {
                const cx = n.x * H + M + offset;
                const cy = n.y * V + M;
                const isLeaf = n.leftId === null && n.rightId === null;
                const isHi = n.id === highlightId;
                parts.push(this.treeNode(cx, cy, n.ch, n.freq, isLeaf, isHi));
            });
        });

        parts.push(`</svg>`);
        return parts.join('');
    }

    /**
     * SVG string for one tree edge with its 0/1 label.
     */
    treeEdge(x1, y1, x2, y2, label) {
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="tree-edge"/>` +
               `<text x="${mx}" y="${my - 4}" class="tree-edge-label">${label}</text>`;
    }

    /**
     * SVG string for one tree node.
     */
    treeNode(cx, cy, ch, freq, isLeaf, isHi) {
        const cls = `tree-node ${isLeaf ? 'leaf' : 'internal'} ${isHi ? 'highlight' : ''}`;
        const inner = isLeaf ? (ch ?? '?') : freq;
        let html = `<g class="${cls}" transform="translate(${cx}, ${cy})">`;
        html += `<circle r="24" class="tree-circle"/>`;
        html += `<text y="1" class="tree-label">${inner}</text>`;
        if (isLeaf) html += `<text y="41" class="tree-freq">${freq}</text>`;
        html += `</g>`;
        return html;
    }
}
