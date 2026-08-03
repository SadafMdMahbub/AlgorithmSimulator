/**
 * @fileoverview Global constants for the AlgoViz application.
 */

export const COLORS = {
    PRIMARY: '#6366f1', // Indigo 500
    SECONDARY: '#8b5cf6', // Violet 500
    ACCENT: '#06b6d4', // Cyan 500
    SUCCESS: '#10b981', // Emerald 500
    DANGER: '#ef4444', // Red 500
    WARNING: '#f59e0b', // Amber 500

    NODE_DEFAULT: '#ffffff',
    NODE_VISITED: '#f59e0b',
    NODE_ACTIVE: '#10b981',
    NODE_MST: '#8b5cf6',
    NODE_PATH: '#10b981',
    NODE_BORDER: '#e2e8f0',

    EDGE_DEFAULT: '#cbd5e1',
    EDGE_HIGHLIGHT: '#ef4444',
    EDGE_PATH: '#10b981'
};

export const DIMENSIONS = {
    NODE_RADIUS: 22,
    EDGE_WIDTH: 2,
    EDGE_HIGHLIGHT_WIDTH: 3
};

export const ALGO_TYPES = {
    BFS: 'BFS',
    DFS: 'DFS',
    DIJKSTRA: 'DIJKSTRA',
    PRIM: 'PRIM'
};

export const STEP_TYPES = {
    VISIT: 'visit',
    COMPARE: 'compare',
    DISCOVER: 'discover',
    MST_ADD: 'mst_add',
    PATH_UPDATE: 'path_update'
};
