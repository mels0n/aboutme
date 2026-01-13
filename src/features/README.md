# Features Layer

## Overview
This directory contains **Feature Slices** in accordance with Feature-Sliced Design (FSD). A Feature Slice represents a specific business value or functional capability of the application.

## Governance Rules
1.  **Semantic Twin:** Every feature *must* have a corresponding public-facing guide or FAQ page in `src/app/guide`.
2.  **Organization:** Code is grouped by **business domain** (e.g., `ai-faq`, `persona-explanation`), not technical type.
3.  **Isolation:** Features should be loosely coupled. Cross-feature communication should happen via the `pages` or `app` layer, or via shared `entities`.

## Current Implementations

- **`persona-explanation`**: Logic for explaining the "Tri-Modal" persona concept.
