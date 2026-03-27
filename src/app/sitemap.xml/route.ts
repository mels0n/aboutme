import { officeBlogPosts } from '@/shared/data/office_blog_posts';
import { officeCaseStudies } from '@/shared/data/office_case_studies';

const BASE_URL = 'https://chris.melson.us';

/**
 * Sitemap Route Handler — replaces Next.js built-in sitemap.ts convention.
 *
 * Why a custom handler instead of sitemap.ts:
 * - Next.js's built-in sitemap convention does not expose response headers.
 * - Vercel was serving the sitemap without a Content-Type header, causing
 *   Google Search Console to classify it as "Unknown" and fail to fetch it.
 * - This handler explicitly sets `Content-Type: text/xml; charset=utf-8`
 *   (the MIME type Google requires for XML sitemaps per their spec) and a
 *   24-hour CDN cache to avoid Vercel cold-start timeouts during Googlebot crawls.
 */
export async function GET(): Promise<Response> {
    const now = new Date().toISOString();

    const staticRoutes: SitemapEntry[] = [
        { url: BASE_URL, changefreq: 'monthly', priority: 1.0, lastmod: now },
        { url: `${BASE_URL}/about`, changefreq: 'monthly', priority: 0.8, lastmod: now },
        { url: `${BASE_URL}/faq`, changefreq: 'monthly', priority: 0.8, lastmod: now },
        { url: `${BASE_URL}/guide/lab`, changefreq: 'monthly', priority: 0.8, lastmod: now },
        {
            url: `${BASE_URL}/guide/operational-architecture/case-studies`,
            changefreq: 'monthly',
            priority: 1.0,
            lastmod: now,
        },
        {
            url: `${BASE_URL}/guide/operational-architecture/blog`,
            changefreq: 'monthly',
            priority: 1.0,
            lastmod: now,
        },
    ];

    const blogRoutes: SitemapEntry[] = officeBlogPosts.map(post => ({
        url: `${BASE_URL}/guide/operational-architecture/blog/${post.slug}`,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date(post.date).toISOString(),
    }));

    const caseStudyRoutes: SitemapEntry[] = officeCaseStudies.map(study => ({
        url: `${BASE_URL}/guide/operational-architecture/case-studies/${study.slug}`,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date(study.date).toISOString(),
    }));

    const allRoutes = [...staticRoutes, ...caseStudyRoutes, ...blogRoutes];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(xml, {
        headers: {
            // text/xml is what Google's sitemap spec explicitly requires.
            // application/xml is technically correct but triggers "Unknown" in Search Console.
            'Content-Type': 'text/xml; charset=utf-8',
            // Cache at CDN edge for 24h, stale-while-revalidate prevents cold-start
            // timeouts from causing Googlebot to see a missing or slow response.
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
        },
    });
}

interface SitemapEntry {
    url: string;
    changefreq: string;
    priority: number;
    lastmod: string;
}
