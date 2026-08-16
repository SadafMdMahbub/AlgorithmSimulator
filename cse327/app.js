/* ============================================================
   AlgoViz · CSE327 — SDLC Model Simulator
   Interactive visualizations of classic software process models:
   1. Waterfall Model          (sequential cascade)
   2. Incremental Development  (definition → increments → output)
   ============================================================ */

/* ============================================================
   MODEL DEFINITIONS
   Each model describes: boxes (absolutely positioned in a fixed
   960 x 560 scene), groups, band labels, svg edges, sidebar nav
   ranges and per-step detail content.
   ============================================================ */

const WATERFALL = {
    id: "waterfall",
    name: "Waterfall Model — SDLC",
    phaseTitle: "Waterfall Phases",
    overview: {
        icon: "fa-water",
        title: "The Waterfall Model",
        desc: "A <strong>sequential</strong> SDLC approach: each phase flows into the next like a waterfall and must be completed before the following one begins.",
        bullets: [
            "Linear — no overlapping phases",
            "Documentation-driven",
            "Review & sign-off at each step",
            "Best when requirements are stable"
        ]
    },
    boxes: [
        { x: 24,  y: 30,  w: 240, h: 72, num: "1", label: ["Requirements", "Definition"], sub: "System services & constraints", step: 0 },
        { x: 192, y: 142, w: 240, h: 72, num: "2", label: ["System & Software", "Design"], sub: "Architecture & interfaces", step: 1 },
        { x: 360, y: 254, w: 240, h: 72, num: "3", label: ["Implementation", "& Unit Testing"], sub: "Realize design as program units", step: 2 },
        { x: 528, y: 366, w: 240, h: 72, num: "4", label: ["Integration &", "System Testing"], sub: "Verify the whole system", step: 3 },
        { x: 696, y: 478, w: 240, h: 72, num: "5", label: ["Operation", "& Maintenance"], sub: "Longest life-cycle phase", step: 4 }
    ],
    edges: [
        // vertical falls from box i into box i+1 (enter = step index the edge points into)
        { d: "M 228 102 L 228 136", arrow: "M 223 132 L 233 132 L 228 142 Z", enter: 1 },
        { d: "M 396 214 L 396 248", arrow: "M 391 244 L 401 244 L 396 254 Z", enter: 2 },
        { d: "M 564 326 L 564 360", arrow: "M 559 356 L 569 356 L 564 366 Z", enter: 3 },
        { d: "M 732 438 L 732 472", arrow: "M 727 468 L 737 468 L 732 478 Z", enter: 4 }
    ],
    nav: [
        { label: "Requirements Definition", icon: "fa-clipboard-list", from: 0, to: 0 },
        { label: "System & Software Design", icon: "fa-sitemap", from: 1, to: 1 },
        { label: "Implementation & Unit Testing", icon: "fa-code", from: 2, to: 2 },
        { label: "Integration & System Testing", icon: "fa-vials", from: 3, to: 3 },
        { label: "Operation & Maintenance", icon: "fa-cogs", from: 4, to: 4 }
    ],
    steps: [
        {
            status: "Phase 1 — Requirements Definition",
            chip: "Phase 1 of 5", icon: "fa-clipboard-list", title: "Requirements Definition",
            desc: "System services, constraints and objectives are established by consultation with system users. They are then defined in detail and serve as the system specification.",
            activities: ["Elicit requirements from stakeholders", "Define services, constraints & objectives", "Produce the requirements specification", "Review and sign-off before design"]
        },
        {
            status: "Phase 2 — System & Software Design",
            chip: "Phase 2 of 5", icon: "fa-sitemap", title: "System & Software Design",
            desc: "The systems design process allocates requirements to hardware or software and establishes an overall system architecture. Software design represents subsystems as components and their interfaces.",
            activities: ["Partition requirements to subsystems", "Establish overall system architecture", "Design software components & interfaces", "Produce the design document (SDD)"]
        },
        {
            status: "Phase 3 — Implementation & Unit Testing",
            chip: "Phase 3 of 5", icon: "fa-code", title: "Implementation & Unit Testing",
            desc: "The software design is realized as a set of programs or program units. Unit testing verifies that each unit meets its specification before integration.",
            activities: ["Implement each designed component", "Write code following the design", "Unit test against specifications", "Fix defects found at unit level"]
        },
        {
            status: "Phase 4 — Integration & System Testing",
            chip: "Phase 4 of 5", icon: "fa-vials", title: "Integration & System Testing",
            desc: "The individual program units are integrated and tested as a complete system to ensure the software requirements have been met. After testing, the software system is delivered to the customer.",
            activities: ["Integrate units into the full system", "System test against requirements", "Acceptance testing with the customer", "Deliver the validated system"]
        },
        {
            status: "Phase 5 — Operation & Maintenance",
            chip: "Phase 5 of 5", icon: "fa-cogs", title: "Operation & Maintenance",
            desc: "Normally the longest life-cycle phase. The system is installed and put into practical use. Maintenance corrects errors not discovered earlier, improves implementation and enhances services as new requirements emerge.",
            activities: ["Deploy the system into operation", "Correct remaining defects", "Improve unit implementations", "Enhance services for new needs"]
        }
    ],
    finishStatus: "Waterfall complete — the system is delivered to the customer ✓",
    finishLog: "✔ System tested, delivered & operational — waterfall complete"
};

const INCREMENTAL = {
    id: "incremental",
    name: "Incremental Development — SDLC",
    phaseTitle: "Incremental Process",
    overview: {
        icon: "fa-layer-group",
        title: "Incremental Development",
        desc: "The system is specified first (requirements → architecture), then built and delivered as a <strong>sequence of usable increments</strong>. Each increment is developed, validated and integrated in turn.",
        bullets: [
            "Working software after each increment",
            "Highest-priority features delivered first",
            "Early user feedback guides later work",
            "Easier to accommodate change than waterfall"
        ]
    },
    labels: [
        { x: 30, y: 14, w: 900, text: "Definition Activities" },
        { x: 30, y: 124, w: 900, text: "Development Activities" }
    ],
    boxes: [
        { x: 30,  y: 40,  w: 280, h: 56, num: "1", label: ["System Requirements"], sub: "Services, constraints & priorities", step: 0 },
        { x: 650, y: 40,  w: 280, h: 56, num: "2", label: ["System Architecture"], sub: "Structure & increment plan", step: 1 },
        // Increment 1 (group at 30,150)
        { x: 45,  y: 190, w: 250, h: 46, num: "1", label: ["Develop System Increment"], sub: "", step: 2, mini: true },
        { x: 45,  y: 260, w: 250, h: 46, num: "2", label: ["Validate Increment"], sub: "", step: 3, mini: true },
        { x: 45,  y: 330, w: 250, h: 46, num: "3", label: ["Integrate Increment"], sub: "", step: 4, mini: true },
        // Increment 2 (group at 340,150)
        { x: 355, y: 190, w: 250, h: 46, num: "1", label: ["Develop System Increment"], sub: "", step: 5, mini: true },
        { x: 355, y: 260, w: 250, h: 46, num: "2", label: ["Validate Increment"], sub: "", step: 6, mini: true },
        { x: 355, y: 330, w: 250, h: 46, num: "3", label: ["Integrate Increment"], sub: "", step: 7, mini: true },
        // Increment 3 (group at 650,150)
        { x: 665, y: 190, w: 250, h: 46, num: "1", label: ["Develop System Increment"], sub: "", step: 8, mini: true },
        { x: 665, y: 260, w: 250, h: 46, num: "2", label: ["Validate Increment"], sub: "", step: 9, mini: true },
        { x: 665, y: 330, w: 250, h: 46, num: "3", label: ["Integrate Increment"], sub: "", step: 10, mini: true },
        // Output bar
        { x: 30,  y: 460, w: 900, h: 56, num: "✓", label: ["Validated System Increments"], sub: "Delivered increment by increment", step: 11, center: true }
    ],
    groups: [
        { x: 30,  y: 150, w: 280, h: 236, title: "Increment 1", sub: "Core — highest priority", from: 2, to: 4 },
        { x: 340, y: 150, w: 280, h: 236, title: "Increment 2", sub: "Next priority features", from: 5, to: 7 },
        { x: 650, y: 150, w: 280, h: 236, title: "Increment 3", sub: "Remaining features", from: 8, to: 10 }
    ],
    edges: [
        // definition band
        { d: "M 314 68 L 640 68", arrow: "M 638 63 L 638 73 L 648 68 Z", enter: 1 },
        // architecture elbows down into increment 1
        { d: "M 790 96 L 790 118 L 200 118 L 200 140", arrow: "M 195 138 L 205 138 L 200 148 Z", enter: 2 },
        // increment 1 internal flow
        { d: "M 170 236 L 170 250", arrow: "M 165 248 L 175 248 L 170 258 Z", enter: 3 },
        { d: "M 170 306 L 170 320", arrow: "M 165 318 L 175 318 L 170 328 Z", enter: 4 },
        // increment 1 → 2
        { d: "M 314 268 L 330 268", arrow: "M 328 263 L 328 273 L 338 268 Z", enter: 5 },
        // increment 2 internal flow
        { d: "M 480 236 L 480 250", arrow: "M 475 248 L 485 248 L 480 258 Z", enter: 6 },
        { d: "M 480 306 L 480 320", arrow: "M 475 318 L 485 318 L 480 328 Z", enter: 7 },
        // increment 2 → 3
        { d: "M 624 268 L 640 268", arrow: "M 638 263 L 638 273 L 648 268 Z", enter: 8 },
        // increment 3 internal flow
        { d: "M 790 236 L 790 250", arrow: "M 785 248 L 795 248 L 790 258 Z", enter: 9 },
        { d: "M 790 306 L 790 320", arrow: "M 785 318 L 795 318 L 790 328 Z", enter: 10 },
        // every increment drains down into the validated output bar
        { d: "M 170 390 L 170 450", arrow: "M 165 448 L 175 448 L 170 458 Z", enter: 11, drainFrom: 4 },
        { d: "M 480 390 L 480 450", arrow: "M 475 448 L 485 448 L 480 458 Z", enter: 11, drainFrom: 7 },
        { d: "M 790 390 L 790 450", arrow: "M 785 448 L 795 448 L 790 458 Z", enter: 11 }
    ],
    nav: [
        { label: "System Requirements", icon: "fa-clipboard-list", from: 0, to: 0 },
        { label: "System Architecture", icon: "fa-sitemap", from: 1, to: 1 },
        { label: "Increment 1", icon: "fa-cubes", from: 2, to: 4 },
        { label: "Increment 2", icon: "fa-cubes", from: 5, to: 7 },
        { label: "Increment 3", icon: "fa-cubes", from: 8, to: 10 },
        { label: "Validated System", icon: "fa-clipboard-check", from: 11, to: 11 }
    ],
    steps: [
        {
            status: "Definition — establishing system requirements",
            chip: "Definition · Step 1", icon: "fa-clipboard-list", title: "System Requirements",
            desc: "System capabilities are established in outline together with stakeholders and prioritized, so the highest-priority requirements are assigned to the first increment.",
            activities: ["Elicit & prioritize requirements", "Define services & constraints", "Agree the scope of each increment", "Set acceptance criteria"]
        },
        {
            status: "Definition — defining the system architecture",
            chip: "Definition · Step 2", icon: "fa-sitemap", title: "System Architecture",
            desc: "An overall system architecture is defined, requirements are mapped onto increments, and the interfaces between increments are identified.",
            activities: ["Define the system structure", "Assign requirements to increments", "Plan the increment order", "Specify increment interfaces"]
        },
        incStep(1, "develop", "Increment 1 — developing the highest-priority increment"),
        incStep(1, "validate", "Increment 1 — validating against its requirements"),
        incStep(1, "integrate", "Increment 1 — integrating (first usable release)"),
        incStep(2, "develop", "Increment 2 — developing next-priority functionality"),
        incStep(2, "validate", "Increment 2 — validating the increment"),
        incStep(2, "integrate", "Increment 2 — integrating with Increment 1"),
        incStep(3, "develop", "Increment 3 — developing the remaining features"),
        incStep(3, "validate", "Increment 3 — validating the increment"),
        incStep(3, "integrate", "Increment 3 — integrating the final increment"),
        {
            status: "All increments validated & integrated — system complete ✓",
            chip: "Output", icon: "fa-clipboard-check", title: "Validated System Increments",
            desc: "Each increment has been developed, validated and integrated in turn — the complete system is the sum of validated, usable increments delivered step by step.",
            activities: ["Every increment validated", "Usable release after each step", "Feedback shaped later increments", "Final system fully integrated"]
        }
    ],
    finishStatus: "Incremental development complete — every increment validated & integrated ✓",
    finishLog: "✔ All increments developed, validated & integrated — system complete"
};

/* Builder for the repeating per-increment step details */
function incStep(n, kind, status) {
    if (kind === "develop") return {
        status,
        chip: `Increment ${n} · 1 of 3`, icon: "fa-code", title: "Develop System Increment",
        desc: `The functionality assigned to Increment ${n} is designed, coded and unit-tested, following the overall system architecture.`,
        activities: [`Design increment ${n}`, "Implement the functionality", "Unit test the new code", "Review against the architecture"]
    };
    if (kind === "validate") return {
        status,
        chip: `Increment ${n} · 2 of 3`, icon: "fa-vials", title: "Validate Increment",
        desc: `Increment ${n} is tested against its requirements before integration, checking that the new functionality behaves as specified.`,
        activities: ["Test against requirements", "Run functional tests", "Check interfaces & quality", "Fix defects found"]
    };
    return {
        status,
        chip: `Increment ${n} · 3 of 3`, icon: "fa-puzzle-piece", title: "Integrate Increment",
        desc: `The validated increment ${n} is integrated with previously delivered increments and the combined system is regression-tested, producing a new usable release.`,
        activities: ["Merge with earlier increments", "Regression-test the system", "Produce a usable release", "Gather user feedback"]
    };
}

const REUSE = {
    id: "reuse",
    name: "Reuse-Oriented SE — SDLC",
    phaseTitle: "Reuse-Based Process",
    overview: {
        icon: "fa-recycle",
        title: "Reuse-Oriented SE",
        desc: "The system is assembled by <strong>searching for and adapting existing components</strong> rather than developing everything from scratch. Requirements are modified to fit the components found, and design focuses on integrating them.",
        bullets: [
            "Lower cost & faster delivery",
            "Proven, higher-quality components",
            "Requirements adapted to components",
            "Standards compliance through reuse"
        ]
    },
    boxes: [
        { x: 16,  y: 16,  w: 270, h: 64, num: "1", label: ["Requirements", "Specification"], sub: "Establish system services", step: 0 },
        { x: 176, y: 120, w: 270, h: 64, num: "2", label: ["Component Search", "and Selection"], sub: "Find reusable components", step: 1 },
        { x: 336, y: 224, w: 270, h: 64, num: "3", label: ["Requirements", "Modification"], sub: "Adapt to available components", step: 2 },
        { x: 496, y: 328, w: 270, h: 64, num: "4", label: ["System Design", "with Reuse"], sub: "Configure the reused parts", step: 3 },
        { x: 656, y: 432, w: 270, h: 64, num: "5", label: ["Development", "and Integration"], sub: "Compose & integrate the system", step: 4 }
    ],
    stores: [
        { cx: 850, top: 120, bottom: 300, rx: 60, ry: 13, label: "Component Reuse Library", from: 1, to: 4 }
    ],
    edges: [
        // staircase falls
        { d: "M 231 80 L 231 108", arrow: "M 226 110 L 236 110 L 231 118 Z", enter: 1 },
        { d: "M 391 184 L 391 212", arrow: "M 386 214 L 396 214 L 391 222 Z", enter: 2 },
        { d: "M 551 288 L 551 316", arrow: "M 546 318 L 556 318 L 551 326 Z", enter: 3 },
        { d: "M 711 392 L 711 420", arrow: "M 706 422 L 716 422 L 711 430 Z", enter: 4 },
        // bidirectional link: search step ↔ reuse library
        { d: "M 454 152 L 780 152", arrow: "M 454 147 L 454 157 L 446 152 Z M 780 147 L 780 157 L 788 152 Z", activeRange: [1, 4] },
        // library feeds components into design…
        { d: "M 800 302 L 800 360 L 774 360", arrow: "M 774 355 L 774 365 L 766 360 Z", activeRange: [3, 4] },
        // …and into development & integration
        { d: "M 880 302 L 880 420", arrow: "M 875 422 L 885 422 L 880 430 Z", activeRange: [4, 4] }
    ],
    nav: [
        { label: "Requirements Specification", icon: "fa-clipboard-list", from: 0, to: 0 },
        { label: "Component Search & Selection", icon: "fa-search", from: 1, to: 1 },
        { label: "Requirements Modification", icon: "fa-edit", from: 2, to: 2 },
        { label: "System Design with Reuse", icon: "fa-cubes", from: 3, to: 3 },
        { label: "Development & Integration", icon: "fa-puzzle-piece", from: 4, to: 4 }
    ],
    steps: [
        {
            status: "Step 1 — specifying system requirements",
            chip: "Step 1 of 5", icon: "fa-clipboard-list", title: "Requirements Specification",
            desc: "System requirements are established as usual — but because reuse is planned, the specification acts as a draft that may later be modified to match the components actually available.",
            activities: ["Elicit the system requirements", "Treat the specification as a draft", "Identify candidate areas for reuse", "Prioritize the functionality"]
        },
        {
            status: "Step 2 — searching the component reuse library",
            chip: "Step 2 of 5", icon: "fa-search", title: "Component Search & Selection",
            desc: "The component reuse library is searched for existing components that implement the required functionality. Candidates are evaluated and the best-fitting components are selected.",
            activities: ["Search the reuse library", "Evaluate candidate components", "Check standards & interfaces", "Select components to reuse"]
        },
        {
            status: "Step 3 — modifying requirements to fit components",
            chip: "Step 3 of 5", icon: "fa-edit", title: "Requirements Modification",
            desc: "Requirements are refined and modified to reflect the selected reusable components — the system adapts to what is available rather than the other way round.",
            activities: ["Compare requirements with components", "Adjust requirements to fit components", "Resolve mismatches & gaps", "Re-baseline the specification"]
        },
        {
            status: "Step 4 — designing the system with reuse",
            chip: "Step 4 of 5", icon: "fa-cubes", title: "System Design with Reuse",
            desc: "The system architecture is designed around the reused components: how existing parts are configured and connected, instead of designing every element from scratch.",
            activities: ["Design around reused components", "Configure component connections", "Define any glue code needed", "Validate the architecture"]
        },
        {
            status: "Step 5 — developing & integrating the system",
            chip: "Step 5 of 5", icon: "fa-puzzle-piece", title: "Development & Integration",
            desc: "Only the functionality not covered by reusable components is newly developed. Reused and new code are integrated and tested, producing the final system quickly and cheaply.",
            activities: ["Develop only the missing pieces", "Integrate reused + new code", "System & acceptance testing", "Deliver the final product"]
        }
    ],
    finishStatus: "Reuse-oriented development complete — system assembled from proven components ✓",
    finishLog: "✔ Reused components integrated — system delivered faster & cheaper"
};

/* Builder for straight diagonal connectors: computes edge-to-edge line
   + arrowhead from two box centers (default boxes are 270 x 64). */
function diag(from, to, opts = {}) {
    const r = v => Math.round(v);
    const dx = to[0] - from[0], dy = to[1] - from[1];
    const len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    const hw = opts.hw || 135, hh = opts.hh || 32;
    const gap = hw * Math.abs(ux) + hh * Math.abs(uy) + 8;
    const sx = from[0] + ux * gap, sy = from[1] + uy * gap;
    const ex = to[0] - ux * gap, ey = to[1] - uy * gap;
    const tx = ex + ux * 9, ty = ey + uy * 9;
    const bx = ex - ux, by = ey - uy;
    const px = -uy * 4.5, py = ux * 4.5;
    return Object.assign({
        d: `M ${r(sx)} ${r(sy)} L ${r(ex)} ${r(ey)}`,
        arrow: `M ${r(bx + px)} ${r(by + py)} L ${r(bx - px)} ${r(by - py)} L ${r(tx)} ${r(ty)} Z`
    }, opts);
}

const VMODEL = {
    id: "vmodel",
    name: "V-Model — Testing Phases",
    phaseTitle: "V-Model Phases",
    overview: {
        icon: "fa-check-double",
        title: "The V-Model (Plan-Driven)",
        desc: "A plan-driven process shaped like a <strong>V</strong>: specification &amp; design phases descend the left arm, coding sits at the bottom, and the core testing phases climb the right arm — each test level validating its matching design level.",
        bullets: [
            "Testing planned alongside design",
            "Each test level validates its design",
            "Unit → Integration → System → Acceptance",
            "Early test design, late execution"
        ]
    },
    boxes: [
        // left arm — specification & design (top → bottom)
        { x: 10,  y: 16,  w: 250, h: 60, num: "1", label: ["Business Requirements", "Specification"], sub: "Validated by Acceptance Testing (UAT)", step: 0 },
        { x: 72,  y: 122, w: 250, h: 60, num: "2", label: ["System Architecture &", "Requirements Analysis"], sub: "Validated by System Testing", step: 1 },
        { x: 134, y: 228, w: 250, h: 60, num: "3", label: ["Architecture Design", "(High-Level Design)"], sub: "Validated by Integration Testing", step: 2 },
        { x: 196, y: 334, w: 250, h: 60, num: "4", label: ["Module Design", "(Low-Level Design)"], sub: "Validated by Unit Testing", step: 3 },
        // bottom of the V
        { x: 355, y: 466, w: 250, h: 60, num: "5", label: ["Implementation", "(Coding)"], sub: "Bottom of the V", step: 4 },
        // right arm — core testing phases (bottom → top)
        { x: 614, y: 334, w: 250, h: 60, num: "6", label: ["Unit Testing", "(Module Testing)"], sub: "Checks the module design", step: 5 },
        { x: 646, y: 228, w: 250, h: 60, num: "7", label: ["Integration Testing"], sub: "Checks the architecture design", step: 6 },
        { x: 678, y: 122, w: 250, h: 60, num: "8", label: ["System Testing"], sub: "Checks the system architecture", step: 7 },
        { x: 700, y: 16,  w: 250, h: 60, num: "9", label: ["Acceptance Testing", "(UAT)"], sub: "Checks business requirements", step: 8 }
    ],
    edges: [
        // left arm down, across the bottom, right arm up
        diag([135, 46], [197, 152], { enter: 1, hw: 125, hh: 30 }),
        diag([197, 152], [259, 258], { enter: 2, hw: 125, hh: 30 }),
        diag([259, 258], [321, 364], { enter: 3, hw: 125, hh: 30 }),
        diag([321, 364], [480, 496], { enter: 4, hw: 125, hh: 30 }),
        diag([480, 496], [739, 364], { enter: 5, hw: 125, hh: 30 }),
        diag([739, 364], [771, 258], { enter: 6, hw: 125, hh: 30 }),
        diag([771, 258], [803, 152], { enter: 7, hw: 125, hh: 30 }),
        diag([803, 152], [825, 46], { enter: 8, hw: 125, hh: 30 }),
        // dashed validation links: each test level → its matching design level
        { d: "M 694 46 L 272 46", arrow: "M 271 41 L 271 51 L 263 46 Z", dashed: true, activeRange: [8, 8] },
        { d: "M 672 152 L 334 152", arrow: "M 333 147 L 333 157 L 325 152 Z", dashed: true, activeRange: [7, 7] },
        { d: "M 640 258 L 396 258", arrow: "M 395 253 L 395 263 L 387 258 Z", dashed: true, activeRange: [6, 6] },
        { d: "M 608 364 L 458 364", arrow: "M 457 359 L 457 369 L 449 364 Z", dashed: true, activeRange: [5, 5] }
    ],
    nav: [
        { label: "Business Requirements Specification", icon: "fa-clipboard-list", from: 0, to: 0 },
        { label: "System Architecture & Requirements Analysis", icon: "fa-sitemap", from: 1, to: 1 },
        { label: "Architecture Design (HLD)", icon: "fa-cubes", from: 2, to: 2 },
        { label: "Module Design (LLD)", icon: "fa-edit", from: 3, to: 3 },
        { label: "Implementation (Coding)", icon: "fa-code", from: 4, to: 4 },
        { label: "Unit Testing (Module Testing)", icon: "fa-vial", from: 5, to: 5 },
        { label: "Integration Testing", icon: "fa-vials", from: 6, to: 6 },
        { label: "System Testing", icon: "fa-desktop", from: 7, to: 7 },
        { label: "Acceptance Testing (UAT)", icon: "fa-clipboard-check", from: 8, to: 8 }
    ],
    steps: [
        {
            status: "Left arm — business requirements specification",
            chip: "Left Arm · Step 1", icon: "fa-clipboard-list", title: "Business Requirements Specification",
            desc: "The business needs the system must fulfil are specified together with stakeholders. This top-level specification is exactly what Acceptance Testing (UAT) will later validate.",
            activities: ["Capture business needs & goals", "Define scope with stakeholders", "Set acceptance criteria", "Baseline for UAT validation"]
        },
        {
            status: "Left arm — system architecture & requirements analysis",
            chip: "Left Arm · Step 2", icon: "fa-sitemap", title: "System Architecture & Requirements Analysis",
            desc: "Requirements are analysed and the overall system architecture is defined. This level is the reference that System Testing will later validate end-to-end.",
            activities: ["Analyse the system requirements", "Define the overall architecture", "Plan the system test level", "Baseline for System Testing"]
        },
        {
            status: "Left arm — architecture design (high-level design)",
            chip: "Left Arm · Step 3", icon: "fa-cubes", title: "Architecture Design (High-Level Design)",
            desc: "The high-level design defines the subsystems, their interfaces and their interactions. It is the reference that Integration Testing will later validate.",
            activities: ["Design subsystems & interfaces", "Define interactions & data flow", "Plan the integration strategy", "Baseline for Integration Testing"]
        },
        {
            status: "Left arm — module design (low-level design)",
            chip: "Left Arm · Step 4", icon: "fa-edit", title: "Module Design (Low-Level Design)",
            desc: "Each module's internal design — algorithms, classes and data structures — is specified in detail. This is the reference that Unit Testing will later validate.",
            activities: ["Design modules, classes & functions", "Specify algorithms & data structures", "Define the unit test cases", "Baseline for Unit Testing"]
        },
        {
            status: "Bottom of the V — implementation (coding)",
            chip: "Bottom · Step 5", icon: "fa-code", title: "Implementation (Coding)",
            desc: "The bottom of the V: modules are coded following their low-level designs, then handed over to the testing phases that climb the right arm.",
            activities: ["Code each module to its design", "Follow coding standards", "Hand over to unit testing", "Fix defects found by the tests"]
        },
        {
            status: "Right arm — unit testing (module testing)",
            chip: "Right Arm · Test 1", icon: "fa-vial", title: "Unit Testing (Module Testing)",
            desc: "Corresponds to Module Design / Low-Level Design. Tests individual methods, functions, or classes in isolation — verifying that internal logic, algorithms and boundary conditions work as designed before integration.",
            activities: ["Test methods, functions & classes in isolation", "Verify internal logic, algorithms & boundaries", "Isolate dependencies with mock objects", "Automated with JUnit / PyTest frameworks"]
        },
        {
            status: "Right arm — integration testing",
            chip: "Right Arm · Test 2", icon: "fa-vials", title: "Integration Testing",
            desc: "Corresponds to Architecture Design / High-Level Design. Tests interactions, interfaces and data flow between integrated modules or subsystems — exposing flaws in interface specifications, communication protocols, database queries and data-format mismatches.",
            activities: ["Test interfaces & data flow between modules", "Expose protocol & data-format mismatches", "Check database queries & communication", "Top-Down, Bottom-Up or Sandwich strategies"]
        },
        {
            status: "Right arm — system testing",
            chip: "Right Arm · Test 3", icon: "fa-desktop", title: "System Testing",
            desc: "Corresponds to System Architecture / Requirements Analysis. Evaluates the complete, fully integrated software system end-to-end — ensuring functional requirements (business logic, workflows) and non-functional requirements (performance, security, usability, stress under load) are satisfied.",
            activities: ["Evaluate the full system end-to-end", "Verify functional & non-functional needs", "Test performance, security & stress under load", "Production-like environment + E2E suites"]
        },
        {
            status: "Right arm — acceptance testing (UAT)",
            chip: "Right Arm · Test 4", icon: "fa-clipboard-check", title: "Acceptance Testing (UAT)",
            desc: "Corresponds to the Business Requirements Specification. Evaluates system readiness from the end-user or business-owner perspective — validating that the software fulfils business needs and is ready for production deployment.",
            activities: ["Validate business needs & production readiness", "Alpha Testing — internal staff, simulated environment", "Beta Testing — real users, operational environment", "Approve deployment to production"]
        }
    ],
    finishStatus: "V-model complete — every test level validated its matching design ✓",
    finishLog: "✔ Unit → Integration → System → Acceptance — all levels validated"
};

const XP = {
    id: "xp",
    name: "Extreme Programming (XP) — Circle of Life",
    phaseTitle: "XP Cycle Phases",
    overview: {
        icon: "fa-sync-alt",
        title: "Extreme Programming (XP)",
        desc: "An <strong>agile</strong> methodology organized as a continuous circle of life — explore, plan, commit, iterate, release, production — then the cycle repeats with new stories. Core practices: small releases, test-first development, pair programming, refactoring and continuous integration.",
        bullets: [
            "Lightweight, agile & adaptive",
            "Cycle: Explore → Plan → Commit → Iterate → Release → Production",
            "Test-first & pair programming",
            "On-site customer, 40-hour week"
        ]
    },
    boxes: [
        { x: 110, y: 60,  w: 250, h: 72, num: "1", label: ["Explore"], sub: "Stories & spike solutions", step: 0 },
        { x: 600, y: 60,  w: 250, h: 72, num: "2", label: ["Plan"], sub: "Story cards & commitment", step: 1 },
        { x: 708, y: 240, w: 250, h: 72, num: "3", label: ["Commit"], sub: "Story cards & release plan", step: 2 },
        { x: 600, y: 430, w: 250, h: 72, num: "4", label: ["Iterate"], sub: "Pair programming & refactor", step: 3 },
        { x: 110, y: 430, w: 250, h: 72, num: "5", label: ["Release"], sub: "Acceptance tests & delivery", step: 4 },
        { x: 2,   y: 240, w: 250, h: 72, num: "6", label: ["Production"], sub: "Delivered system, new stories", step: 5 }
    ],
    hub: { x: 400, y: 196, size: 160, title: "XP", sub: "The Circle of Life" },
    edges: [
        // clockwise cycle
        { d: "M 364 96 L 592 96", arrow: "M 590 91 L 590 101 L 600 96 Z", enter: 1 },
        { d: "M 650 136 L 650 276 L 700 276", arrow: "M 696 271 L 696 281 L 706 276 Z", enter: 2 },
        { d: "M 770 316 L 770 420", arrow: "M 765 418 L 775 418 L 770 428 Z", enter: 3 },
        { d: "M 596 466 L 368 466", arrow: "M 370 461 L 370 471 L 360 466 Z", enter: 4 },
        { d: "M 106 466 L 56 466 L 56 322", arrow: "M 51 324 L 61 324 L 56 314 Z", enter: 5 },
        // the loop back: production feeds the next exploration
        { d: "M 56 236 L 56 96 L 104 96", arrow: "M 102 91 L 102 101 L 112 96 Z", dashed: true, activeRange: [5, 5] }
    ],
    nav: [
        { label: "Explore", icon: "fa-compass", from: 0, to: 0 },
        { label: "Plan", icon: "fa-calendar", from: 1, to: 1 },
        { label: "Commit", icon: "fa-handshake", from: 2, to: 2 },
        { label: "Iterate", icon: "fa-sync-alt", from: 3, to: 3 },
        { label: "Release", icon: "fa-rocket", from: 4, to: 4 },
        { label: "Production", icon: "fa-server", from: 5, to: 5 }
    ],
    steps: [
        {
            status: "XP — exploring stories & spike solutions",
            chip: "Cycle · Phase 1", icon: "fa-compass", title: "Explore",
            desc: "The team explores the problem space. Customers write user stories describing the required functionality in their own words, while developers build spike solutions to understand risky technology before any estimation is made.",
            activities: ["Customers write user stories", "Build spike solutions for risky technology", "Understand & de-risk the technology", "Prepare stories for estimation"]
        },
        {
            status: "XP — planning with story cards & commitment",
            chip: "Cycle · Phase 2", icon: "fa-calendar", title: "Plan",
            desc: "Story cards are estimated and prioritized. The customer selects which stories go into the next release, and the team agrees a commitment schedule it believes it can meet.",
            activities: ["Estimate the user stories", "Prioritize together with the customer", "Choose stories for the next release", "Agree the commitment schedule"]
        },
        {
            status: "XP — committing to the release plan",
            chip: "Cycle · Phase 3", icon: "fa-handshake", title: "Commit",
            desc: "The team formally commits to the release plan: the selected story cards and the schedule become the promise for the coming iteration — what will be delivered and by when.",
            activities: ["Select the story cards for the release", "Agree the release plan & scope", "Commit to the schedule", "Set expectations with the customer"]
        },
        {
            status: "XP — iterating: test, pair-program, refactor",
            chip: "Cycle · Phase 4", icon: "fa-sync-alt", title: "Iterate",
            desc: "The team builds the software in short iterations: acceptance tests are written first, code is produced by pair programming, the design is refactored continually and everything is integrated often — producing small releases of working software.",
            activities: ["Write acceptance tests first", "Pair programming & continuous integration", "Refactor the design continually", "Small releases of working software"]
        },
        {
            status: "XP — releasing working software",
            chip: "Cycle · Phase 5", icon: "fa-rocket", title: "Release",
            desc: "The release is certified by running the acceptance tests and prepared for delivery — small, frequent releases keep feedback loops short.",
            activities: ["Run the acceptance tests", "Certify the release", "Prepare the delivery", "Keep releases small & frequent"]
        },
        {
            status: "XP — running in production, gathering new stories",
            chip: "Cycle · Phase 6", icon: "fa-server", title: "Production",
            desc: "The delivered system runs in production. Real usage generates feedback and new user stories, which flow back into the next Explore phase — the circle of life continues.",
            activities: ["Operate the delivered system", "Gather feedback from real use", "Generate new user stories", "Feed the next Explore phase"]
        }
    ],
    finishStatus: "XP cycle complete — system in production; the circle of life repeats ✓",
    finishLog: "✔ Production running — new stories feed the next cycle"
};

const MODELS = { waterfall: WATERFALL, incremental: INCREMENTAL, reuse: REUSE, vmodel: VMODEL, xp: XP };

/* ——— Scene geometry (shared fixed coordinate space) ——— */
const SCENE_W = 960;
const SCENE_H = 560;

/* ——— State ——— */
let currentModelId = "waterfall";
let currentStep = -1;        // -1 = not started
let finished = false;
let playing = false;
let playTimer = null;

/* ——— DOM refs ——— */
const sceneEl = document.getElementById("waterfallStage");
const svgEl = document.getElementById("flowSvg");
const navEl = document.getElementById("stageNav");
const statusEl = document.getElementById("statusMsg");
const logEl = document.getElementById("executionLog");
const infoEl = document.getElementById("stageInfo");
const phaseCountEl = document.getElementById("phaseCount");
const progressPctEl = document.getElementById("progressPct");
const modelNameEl = document.getElementById("currentModelName");
const phaseTitleEl = document.getElementById("phaseSectionTitle");
const overviewEl = document.getElementById("modelOverview");

let boxEls = [];       // { el, step }
let groupEls = [];     // { el, from, to }
let edgeEls = [];      // { path, arrow, enter, drainFrom, activeRange }
let navItems = [];     // { el, from, to, stateEl }
let storeEls = [];     // { ellipse, body, label, from, to }

/* ============================================================
   Diagram construction
   ============================================================ */
function clearScene() {
    svgEl.innerHTML = "";
    Array.from(sceneEl.querySelectorAll(".wf-box, .wf-group, .band-label, .wf-store-label, .wf-hub")).forEach(el => el.remove());
    boxEls = []; groupEls = []; edgeEls = []; storeEls = [];
    navEl.innerHTML = "";
    navItems = [];
}

function makeSvg(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
}

function buildDiagram(model) {
    // band labels
    (model.labels || []).forEach(l => {
        const el = document.createElement("div");
        el.className = "band-label";
        el.style.left = l.x + "px";
        el.style.top = l.y + "px";
        el.style.width = l.w + "px";
        el.textContent = l.text;
        sceneEl.appendChild(el);
    });

    // edges (drawn under the boxes)
    (model.edges || []).forEach(e => {
        const baseFlow = "flow" + (e.dashed ? " dashed-link" : "");
        const path = makeSvg("path", { d: e.d, class: baseFlow });
        const arrow = makeSvg("path", { d: e.arrow, class: "flow-marker" });
        svgEl.appendChild(path);
        svgEl.appendChild(arrow);
        edgeEls.push({ path, arrow, enter: e.enter, drainFrom: e.drainFrom, activeRange: e.activeRange, baseFlow });
    });

    // group containers
    (model.groups || []).forEach(g => {
        const el = document.createElement("div");
        el.className = "wf-group";
        el.style.left = g.x + "px";
        el.style.top = g.y + "px";
        el.style.width = g.w + "px";
        el.style.height = g.h + "px";
        el.innerHTML = `
            <div class="wf-group-header">
                <span class="wf-group-title">${g.title}</span>
                <span class="wf-group-sub">${g.sub}</span>
            </div>`;
        el.addEventListener("click", () => { pause(); goToStep(g.from, true); });
        sceneEl.appendChild(el);
        groupEls.push({ el, from: g.from, to: g.to });
    });

    // reuse library cylinders (data-store symbols)
    (model.stores || []).forEach(s => {
        const topRim = s.top + s.ry;
        const bottomRim = s.bottom - s.ry;
        const body = makeSvg("path", {
            d: `M ${s.cx - s.rx} ${topRim} V ${bottomRim} A ${s.rx} ${s.ry} 0 0 0 ${s.cx + s.rx} ${bottomRim} V ${topRim}`,
            class: "wf-store"
        });
        const ellipse = makeSvg("ellipse", { cx: s.cx, cy: topRim, rx: s.rx, ry: s.ry, class: "wf-store" });
        svgEl.appendChild(body);
        svgEl.appendChild(ellipse);

        const label = document.createElement("div");
        label.className = "wf-store-label";
        label.style.left = (s.cx - s.rx + 6) + "px";
        label.style.top = ((s.top + s.bottom) / 2 - 14) + "px";
        label.style.width = (s.rx * 2 - 12) + "px";
        label.textContent = s.label;
        sceneEl.appendChild(label);

        storeEls.push({ ellipse, body, label, from: s.from, to: s.to });
    });

    // central hub circle (XP circle of life)
    if (model.hub) {
        const hub = document.createElement("div");
        hub.className = "wf-hub";
        hub.style.left = model.hub.x + "px";
        hub.style.top = model.hub.y + "px";
        hub.style.width = model.hub.size + "px";
        hub.style.height = model.hub.size + "px";
        hub.innerHTML = `
            <span class="hub-title">${model.hub.title}</span>
            <span class="hub-sub">${model.hub.sub}</span>`;
        sceneEl.appendChild(hub);
    }

    // boxes
    model.boxes.forEach(b => {
        const el = document.createElement("div");
        el.className = "wf-box" + (b.mini ? " mini" : "");
        el.style.left = b.x + "px";
        el.style.top = b.y + "px";
        el.style.width = b.w + "px";
        el.style.height = b.h + "px";
        el.innerHTML = `
            <div class="wf-num">${b.num}</div>
            <div class="wf-text${b.center ? " wf-text-center" : ""}">
                <span class="wf-label">${b.label.join("<br>")}</span>
                ${b.sub ? `<span class="wf-sub">${b.sub}</span>` : ""}
            </div>
            <div class="wf-check"><i class="fas fa-check"></i></div>`;
        el.addEventListener("click", () => { pause(); goToStep(b.step, true); });
        sceneEl.appendChild(el);
        boxEls.push({ el, step: b.step });
    });

    // sidebar navigation
    model.nav.forEach(n => {
        const item = document.createElement("div");
        item.className = "stage-item";
        item.innerHTML = `
            <span class="icon"><i class="fas ${n.icon}"></i></span>
            <span class="label">${n.label}</span>
            <span class="phase-state"><i class="far fa-circle"></i></span>`;
        item.addEventListener("click", () => { pause(); goToStep(n.from, true); });
        navEl.appendChild(item);
        navItems.push({ el: item, from: n.from, to: n.to, stateEl: item.querySelector(".phase-state") });
    });

    // staggered entrance animation
    let delay = 150;
    boxEls.forEach(({ el }) => { setTimeout(() => el.classList.add("revealed"), delay); delay += 70; });
    sceneEl.querySelectorAll(".wf-group, .band-label, .wf-store-label, .wf-hub").forEach(el => {
        el.style.opacity = "0";
        setTimeout(() => { el.style.opacity = "1"; }, 120);
    });
}

/* Fit the fixed scene inside the available container */
function fitScene() {
    const container = document.querySelector(".viz-container");
    const rect = container.getBoundingClientRect();
    const scale = Math.min(rect.width / SCENE_W, rect.height / SCENE_H) * 0.94;
    sceneEl.style.transform = `translate(-50%, -50%) scale(${Math.max(scale, 0.2)})`;
}

/* ============================================================
   Rendering / state transitions
   ============================================================ */
function goToStep(index, viaUser) {
    const model = MODELS[currentModelId];
    if (index < 0 || index >= model.steps.length) return;
    currentStep = index;
    finished = false;

    boxEls.forEach(({ el, step }) => {
        el.classList.toggle("done", step < index);
        el.classList.toggle("active", step === index);
    });
    groupEls.forEach(({ el, from, to }) => {
        el.classList.toggle("active", index >= from && index <= to);
        el.classList.toggle("done", index > to);
    });
    edgeEls.forEach(e => {
        let cls = "";
        if (e.activeRange) {
            cls = index > e.activeRange[1] ? "done" : index >= e.activeRange[0] ? "flowing" : "";
        } else if (e.drainFrom !== undefined) {
            cls = index === model.steps.length - 1 ? "flowing"
                : index > e.drainFrom ? "done" : "";
        } else {
            cls = index >= e.enter ? "done" : index === e.enter - 1 ? "flowing" : "";
        }
        e.path.setAttribute("class", (e.baseFlow || "flow") + (cls ? " " + cls : ""));
        e.arrow.setAttribute("class", "flow-marker" + (cls ? " " + cls : ""));
    });
    storeEls.forEach(s => {
        const active = index >= s.from && index <= s.to;
        s.ellipse.classList.toggle("store-active", active);
        s.body.classList.toggle("store-active", active);
    });
    navItems.forEach(({ el, from, to, stateEl }) => {
        el.classList.toggle("active", index >= from && index <= to);
        el.classList.toggle("done", index > to);
        stateEl.innerHTML = index > to ? '<i class="fas fa-check-circle"></i>'
            : (index >= from && index <= to) ? '<i class="fas fa-circle-notch fa-spin"></i>'
            : '<i class="far fa-circle"></i>';
    });

    updateStats();
    updateInfoPanel(model.steps[index]);
    setStatus(model.steps[index].status);
    log(`▶ ${viaUser ? "Jumped to" : "Step"} ${index + 1}/${model.steps.length} — ${model.steps[index].title}`, "active");
}

function completeSim() {
    const model = MODELS[currentModelId];
    finished = true;
    currentStep = model.steps.length - 1;
    pause();

    boxEls.forEach(({ el }) => { el.classList.add("done"); el.classList.remove("active"); });
    groupEls.forEach(({ el }) => { el.classList.add("done"); el.classList.remove("active"); });
    edgeEls.forEach(e => {
        e.path.setAttribute("class", (e.baseFlow || "flow") + " done");
        e.arrow.setAttribute("class", "flow-marker done");
    });
    storeEls.forEach(s => {
        s.ellipse.classList.remove("store-active");
        s.body.classList.remove("store-active");
        s.ellipse.classList.add("store-done");
        s.body.classList.add("store-done");
    });
    navItems.forEach(({ el, stateEl }) => {
        el.classList.remove("active");
        el.classList.add("done");
        stateEl.innerHTML = '<i class="fas fa-check-circle"></i>';
    });

    updateStats();
    setStatus(model.finishStatus);
    log(model.finishLog, "done");
}

function updateStats() {
    const model = MODELS[currentModelId];
    const total = model.steps.length;
    phaseCountEl.textContent = `${Math.max(currentStep + 1, 0)} / ${total}`;
    const pct = finished ? 100 : currentStep < 0 ? 0 : Math.round((currentStep + 1) / total * 100);
    progressPctEl.textContent = pct + "%";
}

function updateInfoPanel(step) {
    infoEl.innerHTML = `
        <span class="phase-chip"><i class="fas ${step.icon}"></i> ${step.chip}</span>
        <span class="info-title">${step.title}</span>
        <p class="info-desc">${step.desc}</p>
        <span class="info-steps-title">Key Activities</span>
        <ul class="info-steps">
            ${step.activities.map(a => `<li>${a}</li>`).join("")}
        </ul>`;
}

function setStatus(msg) { statusEl.textContent = msg; }

function log(msg, type) {
    const empty = logEl.querySelector(".log-entry");
    if (empty && empty.textContent.includes("Waiting")) empty.remove();
    const time = new Date().toLocaleTimeString([], { hour12: false });
    const entry = document.createElement("div");
    entry.className = "log-entry" + (type ? " log-" + type : "");
    entry.innerHTML = `<span class="log-time">${time}</span>${msg}`;
    logEl.prepend(entry);
    while (logEl.children.length > 60) logEl.lastChild.remove();
}

/* ============================================================
   Model switching
   ============================================================ */
function switchModel(id) {
    if (!MODELS[id] || id === currentModelId) return;
    pause();
    currentModelId = id;
    finished = false;
    currentStep = -1;

    document.querySelectorAll("#modelNav .model-item").forEach(el => {
        el.classList.toggle("active", el.dataset.model === id);
    });

    const model = MODELS[id];
    clearScene();
    buildDiagram(model);
    fitScene();

    modelNameEl.textContent = model.name;
    phaseTitleEl.innerHTML = `<i class="fas fa-list-ol"></i> ${model.phaseTitle}`;
    overviewEl.innerHTML = `
        <span class="info-title"><i class="fas ${model.overview.icon}"></i> ${model.overview.title}</span>
        <p class="info-desc">${model.overview.desc}</p>
        <ul class="info-steps">
            ${model.overview.bullets.map(b => `<li>${b}</li>`).join("")}
        </ul>`;

    phaseCountEl.textContent = `0 / ${model.steps.length}`;
    progressPctEl.textContent = "0%";
    infoEl.innerHTML = '<div class="info-placeholder">Select a step to see its details.</div>';
    setStatus("Ready — Press Play to start the simulation");
    log(`Switched model — ${model.name}`);
}

/* ============================================================
   Playback controls
   ============================================================ */
function next() {
    const model = MODELS[currentModelId];
    if (finished) return;
    if (currentStep === -1) { goToStep(0); return; }
    if (currentStep === model.steps.length - 1) { completeSim(); return; }
    log(`✔ Completed: ${model.steps[currentStep].title}`, "done");
    goToStep(currentStep + 1);
}

function prev() {
    const model = MODELS[currentModelId];
    if (finished) { finished = false; goToStep(model.steps.length - 1); return; }
    if (currentStep <= 0) { resetSim(); return; }
    goToStep(currentStep - 1);
}

function play() {
    if (playing || finished) return;
    playing = true;
    playBtn.classList.add("playing");
    log("▶ Playback started");
    setStatus(currentStep === -1 ? "The process begins to flow…" : "Resuming the flow…");
    playTimer = setInterval(next, getInterval());
    next();
}

function pause() {
    if (!playing) return;
    playing = false;
    playBtn.classList.remove("playing");
    clearInterval(playTimer);
    log("⏸ Playback paused");
}

function getInterval() {
    const speed = parseInt(document.getElementById("speedSlider").value, 10);
    return 3200 - (speed - 1) * 290;   // speed 1 → 3.2s, speed 10 → 0.6s
}

function resetSim() {
    pause();
    finished = false;
    currentStep = -1;
    boxEls.forEach(({ el }) => el.classList.remove("done", "active"));
    groupEls.forEach(({ el }) => el.classList.remove("done", "active"));
    edgeEls.forEach(e => {
        e.path.setAttribute("class", e.baseFlow || "flow");
        e.arrow.setAttribute("class", "flow-marker");
    });
    storeEls.forEach(s => {
        s.ellipse.classList.remove("store-active", "store-done");
        s.body.classList.remove("store-active", "store-done");
    });
    navItems.forEach(({ el, stateEl }) => {
        el.classList.remove("active", "done");
        stateEl.innerHTML = '<i class="far fa-circle"></i>';
    });
    phaseCountEl.textContent = `0 / ${MODELS[currentModelId].steps.length}`;
    progressPctEl.textContent = "0%";
    infoEl.innerHTML = '<div class="info-placeholder">Select a step to see its details.</div>';
    setStatus("Ready — Press Play to start the simulation");
    log("↺ Simulation reset");
}

/* ============================================================
   Wiring
   ============================================================ */
const playBtn = document.getElementById("playBtn");

playBtn.addEventListener("click", () => playing ? pause() : play());
document.getElementById("pauseBtn").addEventListener("click", pause);
document.getElementById("nextBtn").addEventListener("click", () => { pause(); next(); });
document.getElementById("prevBtn").addEventListener("click", () => { pause(); prev(); });
document.getElementById("resetBtn").addEventListener("click", resetSim);
document.getElementById("speedSlider").addEventListener("input", () => {
    if (playing) { clearInterval(playTimer); playTimer = setInterval(next, getInterval()); }
});

document.querySelectorAll("#modelNav .model-item").forEach(el => {
    el.addEventListener("click", () => switchModel(el.dataset.model));
});

document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.code === "Space") { e.preventDefault(); playing ? pause() : play(); }
    else if (e.code === "ArrowRight") { pause(); next(); }
    else if (e.code === "ArrowLeft") { pause(); prev(); }
    else if (e.key.toLowerCase() === "r") resetSim();
});

window.addEventListener("resize", fitScene);

/* ——— User display (same pattern as the dashboard) ——— */
async function loadUser() {
    const display = document.getElementById("userDisplay");
    try {
        const res = await fetch("../user.php", { credentials: "same-origin" });
        const result = await res.json();
        if (result.authenticated && result.user) {
            display.textContent = "👤 " + result.user.username;
            return;
        }
    } catch (err) { /* fall through to localStorage */ }
    const currentUser = localStorage.getItem("currentUser");
    display.textContent = "👤 " + (currentUser || "Guest");
}

/* ——— Init ——— */
buildDiagram(MODELS[currentModelId]);
fitScene();
loadUser();
