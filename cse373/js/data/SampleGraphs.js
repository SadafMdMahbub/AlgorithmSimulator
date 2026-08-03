/**
 * @fileoverview Predefined graph data sets for testing and demo.
 */

export const SAMPLE_GRAPHS = {
    DEFAULT: {
        nodes: [
            { label: 'A', x: 100, y: 100 },
            { label: 'B', x: 300, y: 50 },
            { label: 'C', x: 500, y: 100 },
            { label: 'D', x: 100, y: 300 },
            { label: 'E', x: 300, y: 350 },
            { label: 'F', x: 500, y: 300 },
            { label: 'G', x: 300, y: 200 }
        ],
        edges: [
            { source: 0, target: 1, weight: 4 },
            { source: 0, target: 3, weight: 2 },
            { source: 1, target: 2, weight: 5 },
            { source: 1, target: 6, weight: 3 },
            { source: 2, target: 5, weight: 6 },
            { source: 3, target: 4, weight: 1 },
            { source: 3, target: 6, weight: 7 },
            { source: 4, target: 5, weight: 8 },
            { source: 4, target: 6, weight: 4 },
            { source: 5, target: 6, weight: 2 }
        ]
    }
};
