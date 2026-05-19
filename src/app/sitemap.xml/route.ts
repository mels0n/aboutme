import { officeBlogPosts } from '@/shared/data/office_blog_posts';
import { officeCaseStudies } from '@/shared/data/office_case_studies';

export const dynamic = 'force-static';

const BASE_URL = 'https://chris.melson.us';

type SitemapEntry = {
    url: string;
    lastmod?: string;
    changefreq: string;
    priority: string;
};

export async function GET() {
    const staticRoutes: SitemapEntry[] = [
        { url: BASE_URL, lastmod: '2026-04-24', changefreq: 'monthly', priority: '1.0' },
        { url: `${BASE_URL}/about`, lastmod: '2026-04-23', changefreq: 'monthly', priority: '0.8' },
        { url: `${BASE_URL}/faq`, lastmod: '2026-04-23', changefreq: 'monthly', priority: '0.7' },
        { url: `${BASE_URL}/guide/lab`, lastmod: '2026-05-19', changefreq: 'monthly', priority: '0.8' },
        { url: `${BASE_URL}/guide/office`, lastmod: '2026-05-19', changefreq: 'monthly', priority: '0.8' },
        { url: `${BASE_URL}/guide/operational-architecture`, lastmod: '2026-01-15', changefreq: 'monthly', priority: '1.0' },
        { url: `${BASE_URL}/guide/operational-architecture/case-studies`, lastmod: '2026-01-10', changefreq: 'monthly', priority: '0.9' },
        { url: `${BASE_URL}/guide/operational-architecture/blog`, lastmod: '2026-03-09', changefreq: 'weekly', priority: '0.9' },
    ];

    const caseStudyRoutes: SitemapEntry[] = officeCaseStudies.map(study => ({
        url: `${BASE_URL}/guide/operational-architecture/case-studies/${study.slug}`,
        lastmod: study.date,
        changefreq: 'monthly',
        priority: '0.8',
    }));

    const blogRoutes: SitemapEntry[] = officeBlogPosts.map(post => ({
        url: `${BASE_URL}/guide/operational-architecture/blog/${post.slug}`,
        lastmod: post.date,
        changefreq: 'monthly',
        priority: '0.8',
    }));

    const entries = [...staticRoutes, ...caseStudyRoutes, ...blogRoutes];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `  <url>
    <loc>${e.url}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=86400, no-transform',
        },
    });
}
