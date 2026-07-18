# 🎯 AlgoViz — Algorithm Visualizer

An interactive **algorithm visualization platform** built for **CSE373: Design and Analysis of Algorithms**. Watch sorting, searching, greedy, dynamic programming, graph, and string matching algorithms come to life with real-time visual feedback.

> 🌐 **Live Demo**: Open `index.html` to get started.

---

## ✨ Features

### 🔐 User System
- **Login / Registration** with localStorage-based persistence
- **Usage History** tracking per user action
- Session management across pages

### 📚 Course Dashboard
- Course selection interface with visual cards
- CSE373 (Design and Analysis of Algorithms) — fully implemented
- Extensible placeholder cards for future courses (CSE225, CSE465)

### 🧮 Algorithm Visualizations (CSE373)

| Category | Algorithms |
|----------|------------|
| **Divide & Conquer** | Binary Search, Merge Sort, Quicksort |
| **Greedy** | Fractional Knapsack, Activity Selection, Huffman Coding |
| **Dynamic Programming** | Rod Cutting, Matrix Chain Multiplication, LCS, 0/1 Knapsack |
| **Graph** | BFS, DFS, Dijkstra, Bellman-Ford, Kruskal's MST, Prim's MST |
| **String Matching** | Naive, KMP, Rabin-Karp |

### 🌳 Binary Tree Simulator (Standalone)
A separate interactive **Binary Search Tree** tool (`sim.js`) featuring:
- Insert, Search, Delete operations
- In-Order, Pre-Order, Post-Order, Level-Order traversals
- Auto-generate random trees
- Real-time tree visualization with SVG
- Tree stats: node count, height, min/max values, balanced check, BST validation

---

## 🗂 Project Structure

```
├── index.html          # Login/Registration page
├── dashboard.html      # Course selection dashboard
├── CSE373.html         # Main algorithm visualization hub
├── history.html        # User action history log
├── sim.js              # Standalone Binary Tree Simulator (HTML+JS)
├── README.md           # You are here
└── .gitignore          # Git ignore rules
```

---

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/SadafMdMahbub/AlgorithmSimulator.git
   cd AlgorithmSimulator
   ```

2. **Open the app**
   - Open `index.html` in any modern browser (Chrome, Firefox, Edge)
   - Register a new account or log in with existing credentials
   - Select **CSE373** from the dashboard
   - Choose an algorithm from the left sidebar and click **Play ▶**

3. **Try the Binary Tree Simulator**
   - Open `sim.js` in your browser (yes, it's a self-contained HTML file!)
   - Insert values, run traversals, and explore BST properties

> 💡 No server required — everything runs client-side with localStorage.

---

## 🖥 How It Works

All data is stored locally in the browser using `localStorage`:
- **User accounts** are stored as a JSON map (`users` key)
- **Session** is tracked via `currentUser`
- **History logs** are stored per-user and displayed on the History page

The algorithm visualizations render directly in the browser using HTML, CSS, and vanilla JavaScript — zero dependencies.

---

## 🛠 Tech Stack

| Technology | Usage |
|------------|-------|
| **HTML5** | Structure & layout |
| **CSS3** | Styling, animations, responsive design |
| **Vanilla JavaScript** | All logic, algorithms, DOM manipulation |
| **localStorage** | User data persistence |
| **Font Awesome 6** | Icons |
| **Google Fonts (Inter)** | Typography |
| **SVG** | Tree rendering (sim.js) |

---

## 📸 Preview

| Page | Description |
|------|-------------|
| `index.html` | Login & Register forms with toggle |
| `dashboard.html` | Course grid with clickable cards |
| `CSE373.html` | Full IDE-like layout: sidebar (algorithms) → center (visualization) → right panel (controls & stats) |
| `history.html` | Table of user actions with timestamps |
| `sim.js` | Binary tree with SVG rendering, toolbar, info panel, and output console |

---

## 🤝 Contributing

Contributions are welcome! To add a new algorithm visualization:

1. Add the algorithm logic in the `<script>` section of `CSE373.html`
2. Register it in the sidebar's algorithm list
3. Wire up the play/step controls in the right panel

---

## 📄 License

This project is developed as part of **CSE373: Design and Analysis of Algorithms** coursework.

---

<div align="center">
  Made with ❤️ for interactive learning
</div>
