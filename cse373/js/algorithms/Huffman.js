/**
 * @fileoverview Huffman Coding implementation (Greedy + HashMap).
 *
 * This is a non-graph algorithm. Instead of recording node/edge snapshots
 * like the graph algorithms, it records steps containing a `data` payload
 * that the TableRenderer turns into tables, chips, and the Huffman tree.
 */

/**
 * Serializes the current forest of Huffman subtrees into plain objects so
 * each step is an independent snapshot. Optionally marks a specific live
 * node (the node just merged) so the renderer can highlight it.
 *
 * @param {Array} roots List of live root nodes.
 * @param {Object|null} mark Live node to record the id of.
 * @returns {{trees: Array, markId: number|null}}
 */
function serializeForest(roots, mark) {
    let counter = 0;
    let markId = null;

    const visit = (node) => {
        if (!node) return null;
        const obj = {
            id: ++counter,
            ch: node.ch,
            freq: node.freq,
            left: visit(node.left),
            right: visit(node.right)
        };
        if (node === mark) markId = obj.id;
        return obj;
    };

    return { trees: roots.map(r => visit(r)), markId };
}

export class Huffman {
    /**
     * Encodes an input string using a greedy Huffman tree.
     * @param {string} inputString
     * @returns {Array} List of recorded steps.
     */
    run(inputString) {
        const steps = [];
        const input = (inputString || '').trim();

        if (!input) {
            steps.push({
                operation: 'Huffman: empty input — nothing to encode.',
                data: { kind: 'huffman', input: '', freqTable: [], heap: [], merged: null, codes: null, encoded: null, trees: null, highlightId: null, phase: 'freq' }
            });
            return steps;
        }

        // 1. Build the frequency HashMap
        const freqMap = new Map();
        for (const ch of input) {
            freqMap.set(ch, (freqMap.get(ch) || 0) + 1);
        }
        const freqTable = [...freqMap.entries()].map(([ch, freq]) => ({ ch, freq }));

        steps.push({
            operation: `Frequency HashMap built: ${freqTable.map(f => `'${f.ch}' → ${f.freq}`).join(', ')}.`,
            data: { kind: 'huffman', input, freqTable, heap: freqTable.map(f => ({ ...f })), merged: null, codes: null, encoded: null, trees: null, highlightId: null, phase: 'freq' }
        });

        // Tree node helper (ch === null marks an internal node)
        const makeNode = (ch, freq) => ({ ch, freq, left: null, right: null });

        let heap = freqTable.map(f => makeNode(f.ch, f.freq));
        const sortHeap = () => heap.sort((a, b) => a.freq - b.freq || String(a.ch).localeCompare(String(b.ch)));

        // 2. Greedy merges: repeatedly combine the two smallest nodes
        sortHeap();
        let mergeCount = 0;
        while (heap.length > 1) {
            sortHeap();
            const left = heap.shift();
            const right = heap.shift();
            const merged = makeNode(null, left.freq + right.freq);
            merged.left = left;
            merged.right = right;
            heap.push(merged);
            mergeCount++;

            const forest = serializeForest(heap, merged);

            steps.push({
                operation: `Greedy merge #${mergeCount}: '${left.ch ?? '#'}' (${left.freq}) + '${right.ch ?? '#'}' (${right.freq}) → node ${merged.freq}.`,
                data: {
                    kind: 'huffman',
                    input,
                    freqTable,
                    heap: heap.map(h => ({ ch: h.ch, freq: h.freq })),
                    merged: {
                        a: { ch: left.ch, freq: left.freq },
                        b: { ch: right.ch, freq: right.freq },
                        freq: merged.freq
                    },
                    codes: null,
                    encoded: null,
                    trees: forest.trees,
                    highlightId: forest.markId,
                    phase: 'merge'
                }
            });
        }

        // 3. Generate prefix codes by traversing the tree
        const codes = {};
        const traverse = (node, prefix) => {
            if (!node) return;
            if (node.ch !== null) {
                codes[node.ch] = prefix || '0'; // single unique character edge case
            } else {
                traverse(node.left, prefix + '0');
                traverse(node.right, prefix + '1');
            }
        };
        if (heap.length) traverse(heap[0], '');

        const finalTree = serializeForest(heap, null);

        steps.push({
            operation: `Prefix codes generated: ${Object.entries(codes).map(([ch, code]) => `'${ch}' → ${code}`).join(', ')}.`,
            data: { kind: 'huffman', input, freqTable, heap: [], merged: null, codes, encoded: null, trees: finalTree.trees, highlightId: null, phase: 'codes' }
        });

        // 4. Encode the message and show the result
        const encoded = [...input].map(ch => codes[ch]).join('');
        const originalBits = input.length * 8;

        steps.push({
            operation: `Encoded "${input}" → ${encoded} (${originalBits} bits → ${encoded.length} bits).`,
            data: { kind: 'huffman', input, freqTable, heap: [], merged: null, codes, encoded, trees: finalTree.trees, highlightId: null, phase: 'result' }
        });

        return steps;
    }
}
