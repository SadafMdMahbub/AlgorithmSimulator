# Knapsack 2D Visualization and Detailed Steps

Upgrade the 0/1 Knapsack visualization to use a 2D Dynamic Programming table and provide detailed step-by-step logic (formulas, indexes, and values) below the main visualization.

## User Review Required

> [!IMPORTANT]
> The current implementation uses a 1D rolling array for space optimization. This plan will switch it to a 2D table to match the requested visualization style, which is better for educational purposes.

## Proposed Changes

### Algorithm Logic

#### [MODIFY] [Knapsack.js](file:///C:/xampp/htdocs/project/cse373/js/algorithms/Knapsack.js)
- Change the DP array from 1D `dp[w]` to 2D `dp[i][w]`.
- Update the loop structure to iterate through items `i` and capacity `w` (left-to-right).
- In each step, record the recurrence: `dp[i][w] = max(dp[i-1][w], dp[i-1][w - weight] + value)`.
- Include specific indexes and values used in the formula in the step data for display.
- Track which item is currently being considered and whether it was "taken" for the current capacity.

### UI Rendering

#### [MODIFY] [TableRenderer.js](file:///C:/xampp/htdocs/project/cse373/js/renderer/TableRenderer.js)
- Update `renderKnapsack` to generate an HTML `<table>` (class `dp-table`) instead of the 1D `arr-row`.
- Implement a 2D grid where rows are items and columns are capacities.
- Add a new "Detailed Step Logic" section below the table.
- Display the formula with placeholder names and then with actual values (e.g., `dp[3][5] = max(dp[2][5], dp[2][0] + 18)`).
- Apply highlighting:
    - Current cell being calculated: **Green background** (class `cell-active` or `cell-final`).
    - Source cells (lookup): **Light purple/blue background**.
- Ensure the result box remains at the end of the simulation.

### Styling

#### [MODIFY] [controls.css](file:///C:/xampp/htdocs/project/cse373/css/controls.css)
- Ensure `.dp-table` and its cell states (`.cell-active`, `.cell-final`) are correctly defined to match the screenshot's appearance.
- Add specific styling for the new "Detailed Step Logic" box.

## Verification Plan

### Manual Verification
- Run the 0/1 Knapsack simulation with the default parameters (Capacity: 11, Items: 1:1, 2:6, 5:18, 6:22, 7:28).
- Verify that the table is 2D and matches the layout in the provided screenshot.
- Step through the simulation and confirm the box below shows the correct formula and values for each cell.
- Check that the current cell is highlighted in green.
- Verify the final "Selected Items" and "Total Value" match the expected DP result.
