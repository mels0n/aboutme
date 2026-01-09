# Entities Layer

## Overview
This directory contains **Entities** in accordance with Feature-Sliced Design (FSD). Entities represent the business domain objects (e.g., "Project", "User", "BlogPost").

## Governance Rules
1.  **Data & Model Focus:** This layer handles the *structure* of data (Types/Interfaces) and *data fetching* logic (API calls).
2.  **No Complex Flows:** It should not contain complex user flows (that's `features`) or complex layouts (that's `widgets`).
3.  **Reusability:** Entities are highly reusable across features and widgets.

## Current Implementations
- **`project`**: Data model and fetching for portfolio projects/case studies.
