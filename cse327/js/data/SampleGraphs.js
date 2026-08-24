/**
 * @fileoverview Sample process models for CSE327.
 */

export const SAMPLE_GRAPHS = {
    WATERFALL: {
        nodes: [
            { label: 'Requirements definition', x: 150, y: 80, description: 'Establish system requirements, constraints, and goals through consultation with users.' },
            { label: 'System and software design', x: 350, y: 160, description: 'Partition requirements into hardware/software systems and establish the overall architecture.' },
            { label: 'Implementation and unit testing', x: 550, y: 240, description: 'Software is realized as a set of programs or program units; verified against specifications.' },
            { label: 'Integration and system testing', x: 750, y: 320, description: 'Units are integrated and tested as a complete system to ensure it meets requirements.' },
            { label: 'Operation and maintenance', x: 950, y: 400, description: 'The system is installed and put into use. Maintenance involves fixing errors and enhancing services.' }
        ],
        edges: [
            // Pure sequential flow arrows
            { source: 0, target: 1, weight: 1, directed: true },
            { source: 1, target: 2, weight: 1, directed: true },
            { source: 2, target: 3, weight: 1, directed: true },
            { source: 3, target: 4, weight: 1, directed: true },
            // Feedback loops (backward)
            { source: 1, target: 0, weight: 1 },
            { source: 2, target: 1, weight: 1 },
            { source: 3, target: 2, weight: 1 },
            { source: 4, target: 3, weight: 1 }
        ]
    },
    INCREMENTAL_DEV: {
        groups: [
            { label: 'Iterative Development Cycle', x: 280, y: 50, width: 240, height: 450, color: '#e0f2fe' },
            { label: 'Delivery & Release', x: 620, y: 50, width: 240, height: 450, color: '#e0f2fe' }
        ],
        nodes: [
            { label: 'Overall Requirements', x: 100, y: 50, description: 'Step 1: Gather the overall requirements for the entire project.' },
            { label: 'Module Breakdown', x: 100, y: 275, description: 'Step 2: Divide the project into smaller modules or increments.' },
            // Concurrent activities (Development Cycle)
            { label: 'Specification', x: 400, y: 125, description: 'Defining the specific features for the current increment.' },
            { label: 'Development', x: 400, y: 275, description: 'Step 3 & 5: Developing the current increment (starting with most important features).' },
            { label: 'Validation', x: 400, y: 425, description: 'Testing the increment to ensure quality before delivery.' },
            // Versions
            { label: 'Working Version', x: 740, y: 125, description: 'Step 4: Delivering the first working version to the customer.' },
            { label: 'Next Increments', x: 740, y: 275, description: 'Step 6: Repeating the cycle to add more features via successive increments.', isStacked: true },
            { label: 'Completed Software', x: 740, y: 425, description: 'The final, complete software after all increments are delivered.' }
        ],
        edges: [
            // Sequence
            { source: 0, target: 1, weight: 1 },
            { source: 1, target: 3, weight: 1 },
            // Cycle
            { source: 2, target: 3, weight: 1 },
            { source: 3, target: 4, weight: 1 },
            // Delivery flows
            { source: 2, target: 5, weight: 1 },
            { source: 3, target: 6, weight: 1 },
            { source: 4, target: 7, weight: 1 }
        ]
    },
    EXTREME_PROG: {
        nodes: [
            { label: 'User Stories', x: 150, y: 100, description: 'Customers describe desired features as small stories.', color: '#f3e8ff', stroke: '#a855f7' },
            { label: 'Planning Game', x: 400, y: 100, description: 'Decision-making process where users and developers decide which stories to implement.', color: '#f0fdf4', stroke: '#22c55e' },
            { label: 'Short Iteration', x: 650, y: 100, description: 'Rapid development cycles, typically lasting 1-2 weeks.', color: '#fff7ed', stroke: '#f97316' },
            { label: 'Tests + Code', x: 650, y: 300, description: 'Test-first development: write unit tests, then implement code to pass them.', color: '#fdf2f8', stroke: '#ec4899' },
            { label: 'Integration', x: 400, y: 300, description: 'Continuous integration of new code into the main system.', color: '#fdf2f8', stroke: '#ec4899' },
            { label: 'Working Software', x: 150, y: 300, description: 'Delivery of functional system increments to the customer.', color: '#f0f9ff', stroke: '#0ea5e9' }
        ],
        edges: [
            { source: 0, target: 1, weight: 1 },
            { source: 1, target: 2, weight: 1 },
            { source: 2, target: 3, weight: 1 },
            { source: 3, target: 4, weight: 1 },
            { source: 4, target: 5, weight: 1 },
            { source: 5, target: 0, weight: 1 } // Feedback loop back to stories
        ]
    },
    DEFAULT: {
        nodes: [
            { label: 'Phase 1', x: 100, y: 100 },
            { label: 'Phase 2', x: 300, y: 100 },
            { label: 'Phase 3', x: 500, y: 100 }
        ],
        edges: [
            { source: 0, target: 1, weight: 1 },
            { source: 1, target: 2, weight: 1 }
        ]
    }
};
