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
