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
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { officeBlogPosts } from '../src/shared/data/office_blog_posts';
import { officeCaseStudies } from '../src/shared/data/office_case_studies';

const BASE_URL = 'https://chris.melson.us';

interface SitemapEntry {
    url: string;
    lastModified: string;
    changeFrequency: 'weekly' | 'monthly';
    priority: number;
}

const staticRoutes: SitemapEntry[] = [
    { url: BASE_URL, lastModified: '2026-08-02', changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: '2026-04-23', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/faq`, lastModified: '2026-04-23', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/guide/lab`, lastModified: '2026-05-19', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/guide/office`, lastModified: '2026-05-19', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/guide/operational-architecture`, lastModified: '2026-01-15', changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE_URL}/guide/operational-architecture/case-studies`, lastModified: '2026-01-10', changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/guide/operational-architecture/blog`, lastModified: '2026-03-09', changeFrequency: 'weekly', priority: 0.9 },
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

const outPath = join(import.meta.dirname, '..', 'public', 'sitemap.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`sitemap.xml written: ${entries.length} URLs -> ${outPath}`);
