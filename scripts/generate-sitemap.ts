// Build-time sitemap generator.
//
// Why this exists: the previous app-router implementations (route handler,
// then the native metadata API in src/app/sitemap.ts) both served
// sitemap.xml through the Next.js router, which attaches
// `Vary: rsc, next-router-state-tree, ...` to every response at request
// time. That header made Google Search Console reject the sitemap on
// submit. Emitting a static file into public/ bypasses the router
// entirely, so the response carries no RSC headers.
//
// Runs via the `prebuild` npm script (tsx), so `next build` on Vercel
// always regenerates it. public/sitemap.xml is gitignored.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { officeBlogPosts } from '../src/shared/data/published_blog_posts';
import { officeCaseStudies } from '../src/shared/data/office_case_studies';

const BASE_URL = 'https://chris.melson.us';

// Pages that list published posts (the blog index, and the guide page's
// latest-posts section) change whenever a post publishes or is updated. Their
// lastmod is the newer of the latest post date and the page's own last layout
// change.
function latestPostDateSince(layoutDate: string): string {
    return officeBlogPosts
        .map(post => post.lastUpdated ?? post.date)
        .reduce((latest, date) => (date > latest ? date : latest), layoutDate);
}
// Static-route dates are the last change to each page's content or layout;
// update the date when the page changes. 2026-10-24: site footer navigation,
// per-page titles and social metadata, structured data on every page.
const SITE_LAYOUT_CHANGED = '2026-10-24';
const blogIndexLastModified = latestPostDateSince(SITE_LAYOUT_CHANGED);
const guideLastModified = latestPostDateSince(SITE_LAYOUT_CHANGED);

interface SitemapEntry {
    url: string;
    lastModified: string;
    changeFrequency: 'weekly' | 'monthly';
    priority: number;
}

const staticRoutes: SitemapEntry[] = [
    { url: BASE_URL, lastModified: SITE_LAYOUT_CHANGED, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: SITE_LAYOUT_CHANGED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/faq`, lastModified: SITE_LAYOUT_CHANGED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/guide/lab`, lastModified: SITE_LAYOUT_CHANGED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/guide/office`, lastModified: SITE_LAYOUT_CHANGED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/guide/operational-architecture`, lastModified: guideLastModified, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE_URL}/guide/operational-architecture/case-studies`, lastModified: SITE_LAYOUT_CHANGED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/guide/operational-architecture/blog`, lastModified: blogIndexLastModified, changeFrequency: 'weekly', priority: 0.9 },
];

const caseStudyRoutes: SitemapEntry[] = officeCaseStudies.map(study => ({
    url: `${BASE_URL}/guide/operational-architecture/case-studies/${study.slug}`,
    lastModified: study.date,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
}));

const blogRoutes: SitemapEntry[] = officeBlogPosts.map(post => ({
    url: `${BASE_URL}/guide/operational-architecture/blog/${post.slug}`,
    lastModified: post.lastUpdated ?? post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
}));

const entries = [...staticRoutes, ...caseStudyRoutes, ...blogRoutes];

// Source dates are plain YYYY-MM-DD. Emit them as full W3C Datetime in UTC so
// lastmod matches the format the other melson.us properties serve (Next's
// metadata API renders Date objects as ISO-8601). Both forms are valid per the
// sitemap XSD, which unions xsd:date and xsd:dateTime; this is for consistency
// across properties. The date itself stays the real content date rather than
// the build timestamp, so lastmod keeps meaning "when the page changed".
function toW3CDatetime(date: string): string {
    return date.includes('T') ? date : `${date}T00:00:00.000Z`;
}

// Format matches what Next's metadata API produced, so the served XML is
// byte-compatible with what Google has already seen.
const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(e => [
        '<url>',
        `<loc>${e.url}</loc>`,
        `<lastmod>${toW3CDatetime(e.lastModified)}</lastmod>`,
        `<changefreq>${e.changeFrequency}</changefreq>`,
        `<priority>${e.priority}</priority>`,
        '</url>',
    ].join('\n')),
    '</urlset>',
    '',
].join('\n');

// Two copies of the same content. /sitemap.xml accumulated ~20 GSC rejections
// during the Vary-header era and Google's fetch scheduler appears to have the
// path on a long retry backoff (accepted-but-never-downloaded since 2026-07-27).
// /sitemap-pages.xml is a history-free URL for a fresh fetch-queue entry;
// robots.txt points there. The old path keeps serving so the existing GSC
// sitemap records don't 404.
for (const filename of ['sitemap.xml', 'sitemap-pages.xml']) {
    const outPath = join(import.meta.dirname, '..', 'public', filename);
    writeFileSync(outPath, xml, 'utf8');
    console.log(`${filename} written: ${entries.length} URLs -> ${outPath}`);
}

// llms.txt: the hand-written template plus the current list of published
// posts, so the article list can never fall behind the blog.
const template = readFileSync(join(import.meta.dirname, 'llms.template.md'), 'utf8')
    .replace(/^<!--[\s\S]*?-->\r?\n/, '');
const articles = [...officeBlogPosts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(post => `- [${post.title}](${BASE_URL}/guide/operational-architecture/blog/${post.slug})`)
    .join('\n');
const llmsPath = join(import.meta.dirname, '..', 'public', 'llms.txt');
if (!template.includes('{{BLOG_ARTICLES}}')) {
    throw new Error('scripts/llms.template.md is missing the {{BLOG_ARTICLES}} placeholder');
}
// A replacer function, so a "$" in a post title is copied literally.
writeFileSync(llmsPath, template.replace('{{BLOG_ARTICLES}}', () => articles), 'utf8');
console.log(`llms.txt written: ${officeBlogPosts.length} articles -> ${llmsPath}`);
