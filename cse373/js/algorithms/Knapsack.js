/**
 * @fileoverview 0/1 Knapsack implementation (Dynamic Programming) using a
 * 2D dp[i][w] table — the standard pedagogical version.
 */

export class Knapsack {
    /**
     * Solves the 0/1 knapsack problem with a 2D DP table.
     * @param {number} capacity Maximum total weight.
     * @param {Array<{name: string, weight: number, value: number}>} items
     * @returns {Array} List of recorded steps.
     */
    run(capacity, items) {
        const steps = [];
        const W = Math.max(0, parseInt(capacity, 10) || 0);
        const n = items.length;

        if (n === 0 || W === 0) {
            steps.push({
                operation: 'Knapsack: no items or zero capacity — nothing to compute.',
                data: { kind: 'knapsack', capacity: W, items, dp: [], phase: 'init', itemIndex: -1, selected: [] }
            });
            return steps;
        }

        // dp[i][w] = best value achievable using first i items at capacity w
        const dp = [];
        for (let i = 0; i <= n; i++) {
            dp.push(new Array(W + 1).fill(0));
        }

        steps.push({
            operation: `Initialized DP table of size ${n + 1}x${W + 1} with zeros. Rows represent items, columns represent capacity.`,
            data: {
                kind: 'knapsack',
                capacity: W,
                items,
                dp: dp.map(row => row.slice()),
                phase: 'init',
                itemIndex: -1,
                selected: []
            }
        });

        for (let i = 1; i <= n; i++) {
            const item = items[i - 1];

            steps.push({
                operation: `Processing ${item.name} (weight ${item.weight}, value ${item.value}).`,
                data: {
                    kind: 'knapsack',
                    capacity: W,
                    items,
                    dp: dp.map(row => row.slice()),
                    phase: 'item',
                    itemIndex: i - 1,
                    selected: []
                }
            });

            for (let w = 0; w <= W; w++) {
                let taken = false;
                let valA = dp[i - 1][w]; // Value if we skip item i
                let valB = -1;           // Value if we take item i

                if (item.weight <= w) {
                    valB = dp[i - 1][w - item.weight] + item.value;
                    if (valB > valA) {
                        dp[i][w] = valB;
                        taken = true;
                    } else {
                        dp[i][w] = valA;
                    }
                } else {
                    dp[i][w] = valA;
                }

                steps.push({
                    operation: `Calculating dp[${i}][${w}].`,
                    data: {
                        kind: 'knapsack',
                        capacity: W,
                        items,
                        dp: dp.map(row => row.slice()),
                        phase: 'update',
                        itemIndex: i - 1,
                        row: i,
                        col: w,
                        valA: valA,
                        valB: valB,
                        lookupA: { r: i - 1, c: w },
                        lookupB: item.weight <= w ? { r: i - 1, c: w - item.weight } : null,
                        taken: taken,
                        selected: []
                    }
                });
            }
        }

        // Rebuild the chosen items
        const selected = [];
        let currW = W;
        for (let i = n; i >= 1; i--) {
            if (dp[i][currW] !== dp[i - 1][currW]) {
                selected.unshift(items[i - 1]);
                currW -= items[i - 1].weight;
            }
        }

        steps.push({
            operation: `Selected items: ${selected.map(it => it.name).join(', ') || 'none'} — total value ${dp[n][W]}.`,
            data: {
                kind: 'knapsack',
                capacity: W,
                items,
                dp: dp.map(row => row.slice()),
                phase: 'result',
                itemIndex: -1,
                selected,
                totalValue: dp[n][W]
            }
        });

        return steps;
    }
}

