# AlgoViz CSE373 - Modular Algorithm Visualizer

A professional, modular, and OOP-based web application for visualizing graph algorithms (BFS, DFS, Dijkstra, Prim).

## Project Structure
- `assets/`: Icons and images.
- `css/`: Modular stylesheets.
- `js/`: 
    - `models/`: Graph, Node, and Edge entities.
    - `algorithms/`: Algorithm logic implementations.
    - `simulation/`: Execution engine and step recorder.
    - `renderer/`: Visual rendering components.
    - `ui/`: User interface controllers and event handlers.
    - `utils/`: Constants and helper functions.
    - `data/`: Sample graph data.
- `documentation/`: Project reports and diagrams.

## Design Patterns
- **Strategy Pattern**: Algorithms are implemented as interchangeable strategies.
- **Observer Pattern**: UI components observe simulation state changes.
- **Command Pattern**: Simulation steps are recorded as commands for undo/redo (step control).
