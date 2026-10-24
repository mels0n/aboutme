# Gatekeeper Widget

## Description
The **Gatekeeper** is the "How this site works" explainer for the "Tri-Modal" leadership concept. It no longer gates the page: it opens only when a visitor clicks "How this site works" in the home page header, and closes with its button, Escape or a click outside. It explains the three lenses:
1.  Strategic Design (Executive)
2.  Resilient Operations (Strategist)
3.  Technical Execution (Engineer)

## Architecture
- **State Management:** Interacts with the global mode store (Zustand).
- **Persistence:** The open state (`introOpen`) is not persisted; only the chosen mode is kept in localStorage.

## Governance
Changes to mode names here **MUST** propagate to:
1.  `src/app/page.tsx` (Metadata)
2.  `src/features/persona-explanation`
