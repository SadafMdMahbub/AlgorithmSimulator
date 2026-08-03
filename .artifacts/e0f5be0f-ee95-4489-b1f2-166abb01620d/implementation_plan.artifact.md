# Implementation Plan: Modular Algorithm Visualizer (CSE373)

Rebuilding the CSE373 Algorithm Visualizer using a professional, modular, and OOP-based architecture. The project will be housed in a new `cse373/` directory to maintain a clean workspace.

## User Review Required

> [!IMPORTANT]
> This project uses **ES6 Modules**. This requires the application to be served via a local server (like XAMPP's Apache) to avoid CORS issues when loading modules. Access it via `http://localhost/project/cse373/index.html`.

- **Aesthetic**: We will preserve the "AlgoViz" design (Inter font, indigo/violet gradients, glassmorphism headers) from the original file while splitting the code.
- **Legacy Cleanup**: The old [CSE373.html](file:///C:/xampp/htdocs/project/CSE373.html) will be deleted only after the new version is verified.

## Proposed Changes

### Phase 1: Folder Structure & Infrastructure
We will create the directory hierarchy and base configuration files.

#### [NEW] Directory Structure
`cse373/` with subfolders: `assets/`, `css/`, `js/` (models, algorithms, simulation, renderer, ui, utils, data), `documentation/`.

### Phase 2: HTML & Modular Styling
Building the skeleton and splitting the CSS into functional blocks.

#### [NEW] [index.html](file:///C:/xampp/htdocs/project/cse373/index.html)
The main entry point, retaining the 3-column layout (Sidebar Left, Viz Center, Sidebar Right).

#### [NEW] [main.css](file:///C:/xampp/htdocs/project/cse373/css/main.css)
Global theme variables and layout.

#### [NEW] [graph.css](file:///C:/xampp/htdocs/project/cse373/css/graph.css)
Node, edge, and canvas-specific styling.

#### [NEW] [controls.css](file:///C:/xampp/htdocs/project/cse373/css/controls.css)
Button styles, sliders, and form inputs.

### Phase 3: Domain Models (OOP)
Defining the mathematical and logical structures.

#### [NEW] [Node.js](file:///C:/xampp/htdocs/project/cse373/js/models/Node.js) & [Edge.js](file:///C:/xampp/htdocs/project/cse373/js/models/Edge.js)
Classes to represent graph components with properties like position, label, and state.

#### [NEW] [Graph.js](file:///C:/xampp/htdocs/project/cse373/js/models/Graph.js)
The core data structure managing adjacency lists and graph-wide operations.

### Phase 4: Simulation Engine & Step Recorder
The "brain" of the visualizer.

#### [NEW] [StepRecorder.js](file:///C:/xampp/htdocs/project/cse373/js/simulation/StepRecorder.js)
A class to capture snapshots of the graph state during algorithm execution.

#### [NEW] [SimulationEngine.js](file:///C:/xampp/htdocs/project/cse373/js/simulation/SimulationEngine.js)
Orchestrates playback (play, pause, next, previous) and timing.

### Phase 5: Algorithms Implementation
Implementing the requested algorithms as specialized classes.

#### [NEW] [BFS.js](file:///C:/xampp/htdocs/project/cse373/js/algorithms/BFS.js), [DFS.js](file:///C:/xampp/htdocs/project/cse373/js/algorithms/DFS.js), [Dijkstra.js](file:///C:/xampp/htdocs/project/cse373/js/algorithms/Dijkstra.js), [Prim.js](file:///C:/xampp/htdocs/project/cse373/js/algorithms/Prim.js)

### Phase 6: Rendering & UI Logic
Connecting the logic to the screen.

#### [NEW] [GraphRenderer.js](file:///C:/xampp/htdocs/project/cse373/js/renderer/GraphRenderer.js)
Handles SVG/Canvas drawing of the graph based on the current simulation step.

#### [NEW] [UIController.js](file:///C:/xampp/htdocs/project/cse373/js/ui/UIController.js)
Main entry point for UI updates and event coordination.

### Phase 7: Cleanup & Integration
#### [MODIFY] [dashboard.html](file:///C:/xampp/htdocs/project/dashboard.html)
Link to `cse373/index.html`.

#### [DELETE] [CSE373.html](file:///C:/xampp/htdocs/project/CSE373.html)

## Verification Plan

### Automated Verification
- Check for JS syntax errors in the modular structure.
- Verify that `index.html` loads all modules without 404s.

### Manual Verification
- **BFS/DFS**: Verify nodes change color in the correct order.
- **Simulation**: Test that pausing and stepping backward correctly reverts the graph's visual state.
- **Responsiveness**: Verify the layout scales on mobile as per the original design.
