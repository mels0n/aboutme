# Gatekeeper Widget

## Description
The **Gatekeeper** is the entry point and mode-switching mechanism for the "Tri-Modal" leadership concept. It controls state transitions between:
1.  Strategic Design (Executive)
2.  Resilient Operations (Strategist)
3.  Technical Execution (Engineer)

## Architecture
- **State Management:** Interacts with the global mode store (Zustand).
- **Persistence:** May persist user preference via cookies/local storage (to be verified).

## Governance
Changes to mode names here **MUST** propagate to:
1.  `src/app/page.tsx` (Metadata)
2.  `src/shared/ui/JsonLd.tsx` (`featureList`)
3.  `src/features/persona-explanation`
