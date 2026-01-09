# Polymorphic Portfolio

> *"It changes as you observe it."*

This is a personal web space for **Chris Melson**, powered by **Next.js 14**, **Tailwind CSS**, and **Framer Motion**.

## Dual Persona Architecture
The site features a global context switch between two distinct views:
1.  **The Office:** A minimalist, high-stakes professional interface designed for C-Suite and Private Equity audiences.
2.  **The Lab:** The original creative playground, housing the interactive and gamified elements.

## The Tri-Modal Core
The "Polymorphic Layout" engine (Executive, Strategist, Engineer) runs underneath both views, rendering content appropriate for the active context.

1.  **The Executive / Boardroom:**
    *   **Focus:** Global Operations, Annual Reports, ROI, Risk.
    *   **Style:** High Contrast White/Navy (Lab) or Clean Corporate (Office).
    
2.  **The Strategist / Architect:**
    *   **Focus:** Target Operating Models (TOM), Game Theory, Process Design.
    *   **Style:** Warm Parchment/Ink (Lab) or Emerald/Systems (Office).

3.  **The Engineer / Builder:**
    *   **Focus:** Technical Execution, API Design, Security.
    *   **Style:** Terminal/Green (Lab) or Indigo/Tech (Office).

## Tech Stack

*   **Framework:** Next.js 16 (App Router)
*   **Styling:** Tailwind CSS 4 + CSS Variables (Hot-swappable themes)
*   **Animation:** Framer Motion (Layout transitions & Intro sequence)
*   **Icons:** Lucide React

## Architecture & AEO Strategy
This project follows a strict **Answer Engine Optimization (AEO)** protocol to ensure maximum visibility in AI-driven search (ChatGPT, Perplexity, Gemini).

*   **Semantic Twins:** Every dynamic blog post (`OfficeBlogModal`) has a corresponding static page (`/guide/...`) with full JSON-LD Schema.
*   **LLMS.txt:** A curated index (`public/llms.txt`) provides AI agents with a direct map of high-value content.
*   **Dynamic Open Graph:** The `/api/og` endpoint generates polymorphic social cards on the fly, matching the user's persona mode (Executive/Strategist/Engineer).

## Content Engine
The content is **Polymorphic**, meaning the same underlying reality is described differently depending on the viewer's lens:
*   **Executive:** Focus on "Cost," "Risk," and "Structure."
*   **Strategist:** Focus on "Models," "Protocol," and "Value Streams."
*   **Engineer:** Focus on "Latency," "Coupling," and "Throughput."

All data is managed in `src/shared/data/office_blog_posts.ts` and rendered via the `OfficeBlogGrid` (Horizontal Scroll) and `OfficeBlogModal` (Deep Linking enabled).

## Getting Started


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
