# Blog Content Workflow

This document outlines the standard procedure for adding, editing, and managing blog posts in the `aboutme` project.

## 1. Directory Structure

Blog posts are stored as individual TypeScript files to manage file size and improve maintainability.

- **Individual Posts:** `src/shared/data/blog-posts/*.ts`
- **Registry:** `src/shared/data/office_blog_posts.ts`

## 2. Adding a New Blog Post

To add a new blog post, follow these steps:

### Step 1: Create the Post File
1.  Navigate to `src/shared/data/blog-posts/`.
2.  Create a new file named `[slug-name].ts` (e.g., `future-of-ai.ts`).
3.  Copy the template below:

```typescript
import { BlogPost } from "../office_blog_posts";

export const myNewPost: BlogPost = {
    id: "unique-id", // Must be unique
    slug: "url-friendly-slug", // Used in URL
    title: "Title of the Post",
    author: "Author Name",
    role: "Operational Architect", // or relevant persona
    date: "YYYY-MM-DD", // Used for sorting (Newest First)
    summary: "Brief summary for the card view.",
    polymorphicSummary: {
        executive: "Summary customized for Executive persona.",
        strategist: "Summary customized for Strategist persona.",
        engineer: "Summary customized for Engineer persona."
    },
    content: `
### Executive Summary

Your Markdown content goes here.

*   Use standard Markdown syntax.
*   **No Em-Dashes**: Use double hyphens (--) or standard hyphens (-).
*   **Lists**: Use asterisks (*) or hyphens (-) for lists.
*   **Citations**: Use [1] format and list them at the bottom.

---

### citations

[1] [Title of Source](link-to-source)
`,
    geoHighlights: [
        { label: "Core Argument", value: "Key takeaway." },
        { label: "Target Audience", value: "Who is this for?" },
        { label: "Key Insight", value: "One line insight." }
    ]
};
```

### Step 2: Register the Post
1.  Open `src/shared/data/office_blog_posts.ts`.
2.  Import your new post at the top:
    ```typescript
    import { myNewPost } from "./blog-posts/future-of-ai";
    ```
3.  Add it to the `officeBlogPosts` array:
    ```typescript
    export const officeBlogPosts: BlogPost[] = [
        agenticShift,
        // ... other posts
        myNewPost // Add your new post here
    ];
    ```

**Note:** The order in the array does NOT matter for display, as the grid component automatically sorts by `date` (newest first).

## 3. Formatting Guidelines

*   **Markdown Engine:** We use `react-markdown` with `remark-gfm`.
*   **Tables:** GFM tables are supported.
*   **Em-Dashes:** Do **not** use em-dashes (`—`). Use standard hyphens (`-`) or double hyphens (`--`) to avoid encoding issues.
*   **Links:** External links automatically open in a new tab.

## 4. Verification

After adding a post:
1.  Run `npm run dev`.
2.  Navigate to the "Office" view.
3.  Verify the card appears in the grid (sorted by date).
4.  Click the card to ensure the modal opens and content renders correctly.
