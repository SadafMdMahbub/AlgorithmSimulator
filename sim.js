<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>🌳 Binary Tree Algorithm Simulator</title>
    <style>
        /* ── Reset & Base ── */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0f1117;
            color: #e4e6eb;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            padding: 20px;
        }

        .app {
            max-width: 1300px;
            width: 100%;
            background: #1a1d27;
            border-radius: 24px;
            padding: 28px 30px 35px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
            display: flex;
            flex-direction: column;
            gap: 22px;
        }

        h1 {
            font-size: 26px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            letter-spacing: -0.3px;
        }
        h1 small {
            font-size: 14px;
            font-weight: 400;
            color: #888ca8;
            margin-left: 8px;
        }

        /* ── Toolbar ── */
        .toolbar {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px 14px;
            background: #232733;
            padding: 14px 20px;
            border-radius: 14px;
            border: 1px solid #2f3445;
        }

        .toolbar label {
            font-size: 13px;
            font-weight: 500;
            color: #b0b5d0;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .toolbar input[type="number"] {
            width: 70px;
            padding: 6px 10px;
            border-radius: 8px;
            border: 1px solid #3a4055;
            background: #141822;
            color: #fff;
            font-size: 14px;
            outline: none;
            transition: 0.2s;
        }
        .toolbar input[type="number"]:focus {
            border-color: #6c7cff;
            box-shadow: 0 0 0 3px rgba(108, 124, 255, 0.25);
        }

        .btn {
            padding: 7px 18px;
            border: none;
            border-radius: 10px;
            font-weight: 500;
            font-size: 13px;
            cursor: pointer;
            transition: 0.2s;
            background: #2f354a;
            color: #d0d5ee;
            border: 1px solid #3f455e;
        }
        .btn:hover {
            background: #3d445e;
            transform: translateY(-1px);
        }
        .btn:active {
            transform: scale(0.97);
        }

        .btn-primary {
            background: #5b6cf0;
            border-color: #6c7cff;
            color: #fff;
        }
        .btn-primary:hover {
            background: #6c7cff;
        }

        .btn-danger {
            background: #d1526a;
            border-color: #e0607a;
            color: #fff;
        }
        .btn-danger:hover {
            background: #e0607a;
        }

        .btn-success {
            background: #2d9d6e;
            border-color: #38b07e;
            color: #fff;
        }
        .btn-success:hover {
            background: #38b07e;
        }

        .btn-warning {
            background: #c28a3a;
            border-color: #d49c44;
            color: #fff;
        }
        .btn-warning:hover {
            background: #d49c44;
        }

        .btn-outline {
            background: transparent;
            border-color: #3f455e;
        }

        .toolbar .sep {
            width: 1px;
            height: 32px;
            background: #2f3445;
        }

        .toolbar .status-badge {
            margin-left: auto;
            font-size: 13px;
            color: #9095b5;
            background: #141822;
            padding: 4px 14px;
            border-radius: 30px;
            border: 1px solid #2f3445;
        }

        /* ── Tree Canvas ── */
        .tree-wrapper {
            background: #13161e;
            border-radius: 16px;
            border: 1px solid #262b3d;
            padding: 20px 10px 20px 10px;
            overflow-x: auto;
            overflow-y: auto;
            min-height: 420px;
            position: relative;
        }

        #treeContainer {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-width: 100%;
            padding: 10px 0;
        }

        .tree-svg {
            display: block;
            max-width: 100%;
            height: auto;
            background: transparent;
        }

        /* ── Info Panel ── */
        .info-panel {
            display: flex;
            flex-wrap: wrap;
            gap: 18px 40px;
            background: #232733;
            padding: 16px 22px;
            border-radius: 14px;
            border: 1px solid #2f3445;
            font-size: 14px;
        }
        .info-panel .info-item {
            display: flex;
            align-items: baseline;
            gap: 6px;
        }
        .info-panel .info-item .label {
            color: #888ca8;
            font-weight: 400;
        }
        .info-panel .info-item .value {
            font-weight: 600;
            color: #d0d5ee;
        }
        .info-panel .info-item .value.highlight {
            color: #7b8cff;
        }

        /* ── Algorithm Output ── */
        .output-area {
            background: #0d1018;
            border-radius: 14px;
            border: 1px solid #262b3d;
            padding: 14px 20px;
            min-height: 58px;
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            font-size: 14px;
            color: #c8cde8;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 6px 12px;
            transition: 0.2s;
        }
        .output-area .tag {
            background: #1f253b;
            padding: 2px 12px;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 500;
            color: #8890b8;
            border: 1px solid #2f3445;
        }
        .output-area .result {
            font-weight: 500;
            color: #e8ecff;
            word-break: break-all;
        }
        .output-area .empty {
            color: #555b7a;
            font-style: italic;
        }

        /* ── Responsive ── */
        @media (max-width: 800px) {
            .app {
                padding: 16px;
            }
            .toolbar {
                flex-direction: column;
                align-items: stretch;
            }
            .toolbar .sep {
                display: none;
            }
            .toolbar .status-badge {
                margin-left: 0;
                text-align: center;
            }
            .info-panel {
                flex-direction: column;
                gap: 8px;
            }
            h1 {
                font-size: 20px;
                flex-wrap: wrap;
            }
        }

        /* scrollbar */
        .tree-wrapper::-webkit-scrollbar {
            height: 8px;
            width: 8px;
        }
        .tree-wrapper::-webkit-scrollbar-track {
            background: #1a1d27;
        }
        .tree-wrapper::-webkit-scrollbar-thumb {
            background: #3a4055;
            border-radius: 10px;
        }
        .tree-wrapper::-webkit-scrollbar-thumb:hover {
            background: #4e5675;
        }
    </style>
</head>
<body>

    <div class="app">
        <!-- Header -->
        <h1>
            🌳 Binary Tree Simulator
            <small>insert · search · delete · traverse · analyze</small>
        </h1>

        <!-- Toolbar -->
        <div class="toolbar">
            <label>
                Value
                <input type="number" id="inputValue" value="42" step="1" />
            </label>

            <button class="btn btn-primary" id="btnInsert">➕ Insert</button>
            <button class="btn btn-warning" id="btnSearch">🔍 Search</button>
            <button class="btn btn-danger" id="btnDelete">✖ Delete</button>

            <span class="sep"></span>

            <button class="btn btn-outline" id="btnInOrder">In‑Order</button>
            <button class="btn btn-outline" id="btnPreOrder">Pre‑Order</button>
            <button class="btn btn-outline" id="btnPostOrder">Post‑Order</button>
            <button class="btn btn-outline" id="btnLevelOrder">Level‑Order</button>

            <span class="sep"></span>

            <button class="btn btn-success" id="btnGenerate">🎲 Generate 10</button>
            <button class="btn btn-danger" id="btnClear">🗑 Clear</button>

            <span class="status-badge" id="statusBadge">⚡ ready</span>
        </div>

        <!-- Tree Visual -->
        <div class="tree-wrapper">
            <div id="treeContainer">
                <svg class="tree-svg" id="treeSvg" width="100%" height="400"></svg>
            </div>
        </div>

        <!-- Info Panel -->
        <div class="info-panel">
            <div class="info-item"><span class="label">Nodes</span><span class="value" id="nodeCount">0</span></div>
            <div class="info-item"><span class="label">Height</span><span class="value" id="treeHeight">0</span></div>
            <div class="info-item"><span class="label">Min</span><span class="value" id="treeMin">—</span></div>
            <div class="info-item"><span class="label">Max</span><span class="value" id="treeMax">—</span></div>
            <div class="info-item"><span class="label">Balanced</span><span class="value" id="treeBalanced">✅</span></div>
            <div class="info-item"><span class="label">BST</span><span class="value" id="treeIsBST">✅</span></div>
        </div>

        <!-- Output -->
        <div class="output-area" id="outputArea">
            <span class="tag">📋 output</span>
            <span class="empty">run an algorithm to see results …</span>
        </div>
    </div>

    <script>
        // ═══════════════════════════════════════════════════════════════
        //  BINARY SEARCH TREE  (BST)
        // ═══════════════════════════════════════════════════════════════

        class Node {
            constructor(val) {
                this.value = val;
                this.left = null;
                this.right = null;
            }
        }

        class BinarySearchTree {
            constructor() {
                this.root = null;
                this.size = 0;
            }

            // ── Insert ──
            insert(val) {
                const newNode = new Node(val);
                if (this.root === null) {
                    this.root = newNode;
                    this.size++;
                    return true;
                }
                let current = this.root;
                while (true) {
                    if (val === current.value) return false; // no duplicates
                    if (val < current.value) {
                        if (current.left === null) {
                            current.left = newNode;
                            this.size++;
                            return true;
                        }
                        current = current.left;
                    } else {
                        if (current.right === null) {
                            current.right = newNode;
                            this.size++;
                            return true;
                        }
                        current = current.right;
                    }
                }
            }

            // ── Search ──
            search(val) {
                let current = this.root;
                while (current) {
                    if (val === current.value) return current;
                    if (val < current.value) current = current.left;
                    else current = current.right;
                }
                return null;
            }

            // ── Delete ──
            delete(val) {
                const removeNode = (node, val) => {
                    if (node === null) return null;
                    if (val < node.value) {
                        node.left = removeNode(node.left, val);
                        return node;
                    } else if (val > node.value) {
                        node.right = removeNode(node.right, val);
                        return node;
                    } else {
                        // found
                        if (node.left === null && node.right === null) {
                            return null;
                        }
                        if (node.left === null) {
                            return node.right;
                        }
                        if (node.right === null) {
                            return node.left;
                        }
                        // two children: get min from right subtree
                        let minNode = this._findMinNode(node.right);
                        node.value = minNode.value;
                        node.right = removeNode(node.right, minNode.value);
                        return node;
                    }
                };
                const newRoot = removeNode(this.root, val);
                if (this.root !== newRoot) {
                    this.size--;
                }
                this.root = newRoot;
                return this.root;
            }

            _findMinNode(node) {
                while (node.left) node = node.left;
                return node;
            }

            // ── Traversals ──
            inOrder() {
                const result = [];
                const traverse = (node) => {
                    if (node) {
                        traverse(node.left);
                        result.push(node.value);
                        traverse(node.right);
                    }
                };
                traverse(this.root);
                return result;
            }

            preOrder() {
                const result = [];
                const traverse = (node) => {
                    if (node) {
                        result.push(node.value);
                        traverse(node.left);
                        traverse(node.right);
                    }
                };
                traverse(this.root);
                return result;
            }

            postOrder() {
                const result = [];
                const traverse = (node) => {
                    if (node) {
                        traverse(node.left);
                        traverse(node.right);
                        result.push(node.value);
                    }
                };
                traverse(this.root);
                return result;
            }

            levelOrder() {
                if (!this.root) return [];
                const queue = [this.root];
                const result = [];
                while (queue.length) {
                    const node = queue.shift();
                    result.push(node.value);
                    if (node.left) queue.push(node.left);
                    if (node.right) queue.push(node.right);
                }
                return result;
            }

            // ── Stats ──
            height() {
                const calc = (node) => {
                    if (!node) return 0;
                    return 1 + Math.max(calc(node.left), calc(node.right));
                };
                return calc(this.root);
            }

            min() {
                if (!this.root) return null;
                let cur = this.root;
                while (cur.left) cur = cur.left;
                return cur.value;
            }

            max() {
                if (!this.root) return null;
                let cur = this.root;
                while (cur.right) cur = cur.right;
                return cur.value;
            }

            isBalanced() {
                const check = (node) => {
                    if (!node) return { balanced: true, height: 0 };
                    const left = check(node.left);
                    const right = check(node.right);
                    const balanced = left.balanced && right.balanced &&
                        Math.abs(left.height - right.height) <= 1;
                    return {
                        balanced,
                        height: 1 + Math.max(left.height, right.height)
                    };
                };
                return check(this.root).balanced;
            }

            // check if BST property holds
            isBST() {
                const validate = (node, min, max) => {
                    if (!node) return true;
                    if ((min !== null && node.value <= min) ||
                        (max !== null && node.value >= max)) return false;
                    return validate(node.left, min, node.value) &&
                        validate(node.right, node.value, max);
                };
                return validate(this.root, null, null);
            }

            // ── Clear ──
            clear() {
                this.root = null;
                this.size = 0;
            }

            // ── Build from array ──
            fromArray(arr) {
                this.clear();
                for (const v of arr) {
                    this.insert(v);
                }
            }

            // ── Get all nodes (for drawing) ──
            getNodes() {
                const nodes = [];
                const traverse = (node, x, y, parentX, parentY) => {
                    if (!node) return;
                    nodes.push({
                        value: node.value,
                        x,
                        y,
                        parentX,
                        parentY,
                        left: !!node.left,
                        right: !!node.right,
                    });
                    const offset = 60 / (y + 1);
                    traverse(node.left, x - offset, y + 1, x, y);
                    traverse(node.right, x + offset, y + 1, x, y);
                };
                traverse(this.root, 400, 0, null, null);
                return nodes;
            }
        }

        // ═══════════════════════════════════════════════════════════════
        //  APP STATE
        // ═══════════════════════════════════════════════════════════════

        const tree = new BinarySearchTree();
        const svg = document.getElementById('treeSvg');
        const outputArea = document.getElementById('outputArea');

        // DOM refs
        const inputVal = document.getElementById('inputValue');
        const nodeCountEl = document.getElementById('nodeCount');
        const treeHeightEl = document.getElementById('treeHeight');
        const treeMinEl = document.getElementById('treeMin');
        const treeMaxEl = document.getElementById('treeMax');
        const treeBalancedEl = document.getElementById('treeBalanced');
        const treeIsBSTEl = document.getElementById('treeIsBST');
        const statusBadge = document.getElementById('statusBadge');

        // ── Helpers ──
        function setOutput(tag, message, isError = false) {
            outputArea.innerHTML = `
                <span class="tag">${tag}</span>
                <span class="result" style="${isError ? 'color:#e0607a;' : ''}">${message}</span>
            `;
        }

        function setStatus(text, isGood = true) {
            statusBadge.textContent = text;
            statusBadge.style.color = isGood ? '#8bc9a0' : '#e0607a';
        }

        function getInputValue() {
            const v = parseInt(inputVal.value);
            if (isNaN(v)) {
                setOutput('⚠️', 'Please enter a valid number.', true);
                return null;
            }
            return v;
        }

        // ── Draw Tree ──
        function drawTree() {
            const nodes = tree.getNodes();
            const width = 800;
            const height = 400;
            svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', height);

            let html = '';

            // Edges
            for (const n of nodes) {
                if (n.parentX !== null && n.parentY !== null) {
                    html += `<line x1="${n.parentX}" y1="${n.parentY + 24}" 
                                   x2="${n.x}" y2="${n.y - 24}" 
                                   stroke="#3f455e" stroke-width="2.5" stroke-linecap="round"/>`;
                }
            }

            // Nodes
            for (const n of nodes) {
                const isLeft = n.parentX !== null && n.x < n.parentX;
                const isRight = n.parentX !== null && n.x > n.parentX;
                const label = n.value;

                // shadow
                html += `<circle cx="${n.x}" cy="${n.y}" r="24" fill="#0d1018" opacity="0.4"/>`;
                // main circle
                html += `<circle cx="${n.x}" cy="${n.y}" r="22" fill="#252b41" stroke="#5b6cf0" stroke-width="2.5"/>`;
                // text
                html += `<text x="${n.x}" y="${n.y + 5}" text-anchor="middle" 
                               fill="#e8ecff" font-size="14" font-weight="600" 
                               font-family="'Segoe UI', sans-serif">${label}</text>`;

                // left / right indicators (tiny)
                if (n.left) {
                    html += `<circle cx="${n.x - 18}" cy="${n.y - 18}" r="5" fill="#2d9d6e" opacity="0.5"/>`;
                }
                if (n.right) {
                    html += `<circle cx="${n.x + 18}" cy="${n.y - 18}" r="5" fill="#d49c44" opacity="0.5"/>`;
                }
            }

            // empty state
            if (nodes.length === 0) {
                html += `<text x="400" y="190" text-anchor="middle" fill="#3f455e" font-size="18" 
                               font-weight="400" font-family="'Segoe UI', sans-serif">
                            🌱 tree is empty — insert values to get started
                        </text>`;
            }

            svg.innerHTML = html;

            // update info panel
            nodeCountEl.textContent = tree.size;
            treeHeightEl.textContent = tree.height();
            const minV = tree.min();
            const maxV = tree.max();
            treeMinEl.textContent = minV !== null ? minV : '—';
            treeMaxEl.textContent = maxV !== null ? maxV : '—';
            treeBalancedEl.textContent = tree.isBalanced() ? '✅' : '❌';
            treeBalancedEl.style.color = tree.isBalanced() ? '#8bc9a0' : '#e0607a';
            treeIsBSTEl.textContent = tree.isBST() ? '✅' : '❌';
            treeIsBSTEl.style.color = tree.isBST() ? '#8bc9a0' : '#e0607a';
        }

        // ── Actions ──

        function handleInsert() {
            const val = getInputValue();
            if (val === null) return;
            if (tree.search(val)) {
                setOutput('⚠️', `Value ${val} already exists in the tree.`, true);
                setStatus('duplicate', false);
                return;
            }
            tree.insert(val);
            drawTree();
            setOutput('✅', `Inserted <strong>${val}</strong> — tree size: ${tree.size}`);
            setStatus(`inserted ${val}`, true);
            inputVal.focus();
        }

        function handleSearch() {
            const val = getInputValue();
            if (val === null) return;
            const found = tree.search(val);
            if (found) {
                setOutput('🔍', `Found <strong>${val}</strong> in the tree.`);
                setStatus(`found ${val}`, true);
                // highlight in tree? we'll just flash via output
            } else {
                setOutput('🔍', `Value <strong>${val}</strong> not found.`, true);
                setStatus('not found', false);
            }
        }

        function handleDelete() {
            const val = getInputValue();
            if (val === null) return;
            if (!tree.search(val)) {
                setOutput('⚠️', `Value <strong>${val}</strong> not found — nothing to delete.`, true);
                setStatus('not found', false);
                return;
            }
            tree.delete(val);
            drawTree();
            setOutput('🗑', `Deleted <strong>${val}</strong> — tree size: ${tree.size}`);
            setStatus(`deleted ${val}`, true);
        }

        function runTraversal(name, fn) {
            if (tree.size === 0) {
                setOutput('📋', 'Tree is empty — nothing to traverse.', true);
                return;
            }
            const result = fn();
            setOutput(`📋 ${name}`, `[ ${result.join(' · ')} ]`);
            setStatus(`${name} done`, true);
        }

        function handleGenerate() {
            const count = 10;
            const vals = [];
            while (vals.length < count) {
                const r = Math.floor(Math.random() * 90) + 5;
                if (!vals.includes(r)) vals.push(r);
            }
            tree.fromArray(vals);
            drawTree();
            setOutput('🎲', `Generated ${count} random values: [ ${vals.join(' · ')} ]`);
            setStatus(`generated ${count} nodes`, true);
        }

        function handleClear() {
            tree.clear();
            drawTree();
            setOutput('🗑', 'Tree cleared.');
            setStatus('cleared', true);
        }

        // ── Bind UI ──

        document.getElementById('btnInsert').addEventListener('click', handleInsert);
        document.getElementById('btnSearch').addEventListener('click', handleSearch);
        document.getElementById('btnDelete').addEventListener('click', handleDelete);
        document.getElementById('btnInOrder').addEventListener('click', () => runTraversal('In-Order', () => tree.inOrder()));
        document.getElementById('btnPreOrder').addEventListener('click', () => runTraversal('Pre-Order', () => tree
        .preOrder()));
        document.getElementById('btnPostOrder').addEventListener('click', () => runTraversal('Post-Order', () => tree
            .postOrder()));
        document.getElementById('btnLevelOrder').addEventListener('click', () => runTraversal('Level-Order', () => tree
            .levelOrder()));
        document.getElementById('btnGenerate').addEventListener('click', handleGenerate);
        document.getElementById('btnClear').addEventListener('click', handleClear);

        // Enter key on input
        inputVal.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleInsert();
        });

        // ── Initial seed ──
        (function init() {
            const seed = [50, 30, 70, 20, 40, 60, 80, 10, 35, 45, 55, 75];
            tree.fromArray(seed);
            drawTree();
            setOutput('🚀', 'Ready!  Try inserting, searching, or traversing.');
            setStatus('ready', true);
        })();

        // ── window resize: redraw ──
        let redrawTimer;
        window.addEventListener('resize', () => {
            clearTimeout(redrawTimer);
            redrawTimer = setTimeout(drawTree, 200);
        });

        console.log('🌳 Binary Tree Simulator loaded!');
        console.log('Tree methods:', Object.getOwnPropertyNames(BinarySearchTree.prototype));
    </script>

</body>
</html>