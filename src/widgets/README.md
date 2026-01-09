# Widgets Layer

## Overview
This directory contains **Widgets** in accordance with Feature-Sliced Design (FSD). Widgets are compositional units that combine multiple `entities` and `features` into standalone UI blocks (e.g., a "Project Dashboard" or "Office View").

## Governance Rules
1.  **Composition:** Widgets should primarily *compose* lower-level units. Heavy business logic should reside in `features`.
2.  **Semantic Twin:** Major widgets (like `office-view` or `lab-view`) essentially represent entire "modes" of the application and must be documented in `src/app/guide`.
3.  **Independence:** Widgets should be relatively independent and reusable on different Pages.

## Current Implementations
- **`office-view`**: The main interface for the "Operational Architect" (Executive/Strategist) modes.
- **`lab-view`**: The interface for the "Engineer" (Technical Execution) mode.
- **`gatekeeper`**: The modal/flow for selecting the operating mode.
