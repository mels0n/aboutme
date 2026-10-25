import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Raw post source is readable only by the build-time generator; the site
  // imports src/shared/data/published_blog_posts.ts instead.
  {
    files: ["**/*.{ts,tsx,mjs,js}"],
    ignores: [
      "eslint.config.mjs",
      "scripts/generate-published-posts.ts",
      "src/shared/data/office_blog_posts.ts",
      "src/shared/data/blog-posts/**",
      "src/shared/data/published-posts.generated.ts",
      "src/shared/data/published-post-cards.generated.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/blog-posts", "**/blog-posts/**", "**/office_blog_posts"],
              message: "Raw post source is generator-only. Import from shared/data/published_blog_posts.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/blog-posts|office_blog_posts/]",
          message: "Raw post source is generator-only. Import from shared/data/published_blog_posts.",
        },
        {
          selector: "TemplateElement[value.raw=/blog-posts|office_blog_posts/]",
          message: "Raw post source is generator-only. Import from shared/data/published_blog_posts.",
        },
      ],
    },
  },
  // Client-side layers list posts with cards only (published_post_cards), so
  // post bodies never ship in browser JavaScript. Flat config replaces a rule
  // per file rather than merging it, so the raw-source patterns are repeated.
  {
    files: ["src/widgets/**/*.{ts,tsx}", "src/features/**/*.{ts,tsx}", "src/shared/ui/**/*.{ts,tsx}", "src/app/HomeClient.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/blog-posts", "**/blog-posts/**", "**/office_blog_posts"],
              message: "Raw post source is generator-only. Import from shared/data/published_blog_posts.",
            },
            {
              group: ["**/published_blog_posts", "**/published-posts.generated"],
              message: "Full posts (with bodies) are for server pages. Client layers import shared/data/published_post_cards.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
