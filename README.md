# Portfolio (Next.js 16 + FSD)

Technical documentation for the `aboutme` project.

## Stack
*   **Framework:** Next.js 16 (App Router)
*   **Styling:** Tailwind CSS 4, Framer Motion
*   **Architecture:** Feature Sliced Design (FSD)
*   **Validation:** Zod, TypeScript (Strict)

## Running Locally

```bash
# Install
npm install

# Dev Server
npm run dev

# Production Build
npm run build
```

## Documentation
- [Blog Creation Workflow](docs/BLOG_WORKFLOW.md)

## Architecture & Governance

### 1. Feature Sliced Design (FSD)
The project structure strictly follows FSD layers:
*   `app/`: Routing and entry points.
*   `processes/`: Global workflows (e.g., Auth, Theme).
*   `pages/`: Page-specific composition.
*   `widgets/`: Complex, self-contained UI blocks (`OfficeHero`, `OfficeNav`).
*   `features/`: Business value slices (`ai-faq`, `persona-explanation`).
*   `entities/`: Domain models and data fetching (`project`, `blog`).
*   `shared/`: Reusable primitives and utilities.

### 2. AEO/GEO Protocol (Semantic Twins)
This project is optimized for Answer Engine Optimization (AEO).
*   **Rule:** Every major feature slice MUST have a corresponding "Semantic Twin" page in `src/app/guide`.
*   **Purpose:** Allows AI agents to index the logic/intent of the feature.
*   **Implementation:** `src/shared/data` serves as the Single Source of Truth (SSOT) for both the UI component and the Guide page.

### 3. Vertical Sliced Architecture (VSA)
Backend/API logic is organized by business feature, not technical layer.
*   See `src/features/` for isolated business logic.
*   Do not share state between features unless via `shared/lib/store`.
