# Shared Layer

## Overview
This directory contains **Shared** resources in accordance with Feature-Sliced Design (FSD). This layer contains reusable code that is not specific to any single business domain.

## Governance Rules
1.  **No Business Logic:** This code must be domain-agnostic. If it contains logic specific to "Tri-Modal Leadership" or "The Lab," it belongs in `entities` or `features`.
2.  **Stability:** Changes here have high impact. Deprecations must be carefully managed.
3.  **UI Kit:** `shared/ui` should contain atomic components (Buttons, Inputs) that are stylistically consistent but functionally dumb.

## Structure
- `ui/`: Reusable React components (Atomic Design atoms/molecules).
- `lib/` or `utils/`: Helper functions and utilities.
- `config/`: Global constants and environment variables.
