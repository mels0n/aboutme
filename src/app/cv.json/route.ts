import { NextResponse } from 'next/server';
import resumeData from '@/shared/data/resume.json';

// Helper to parse dates like "Oct 2023 - Present"
function parseDate(dateStr: string): { startDate: string; endDate?: string } {
    if (!dateStr) return { startDate: '' };

    const [start, end] = dateStr.split(' - ').map(s => s.trim());

    // Simple parser for "MMM YYYY" -> "YYYY-MM-DD"
    const toISO = (d: string) => {
        if (!d || d.toLowerCase() === 'present') return undefined; // Schema doesn't have "Present", usually implies omission of endDate
        const date = new Date(d);
        if (isNaN(date.getTime())) return d; // Fallback
        return date.toISOString().split('T')[0];
    };

    return {
        startDate: toISO(start) || '',
        endDate: toISO(end)
    };
}

// Helper to extract clean text from HTML list items for highlights
function extractHighlights(htmlSummary: string): string[] {
    if (!htmlSummary) return [];
    // Extract text between <p> tags inside <li>, removing HTML tags
    const matches = htmlSummary.match(/<li><p>(.*?)<\/p><\/li>/g);
    if (!matches) return [];

    return matches.map(item => {
        return item.replace(/<\/?(li|p|ul|strong|em)>/g, '')  // Remove tags
            .replace(/&amp;/g, '&')
            .trim();
    });
}

export async function GET() {
    const data = resumeData as any;

    // Transform to JSON Resume Schema (https://jsonresume.org/schema/)
    const jsonResume = {
        $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
        basics: {
            name: data.basics.name,
            label: data.basics.headline,
            image: data.basics.picture.url,
            email: data.basics.email,
            phone: data.basics.phone,
            url: data.basics.url.href,
            summary: data.sections.summary.content.replace(/<[^>]*>/g, '').trim(), // Strip HTML for main summary
            location: {
                city: "Saint Louis",
                region: "MO",
                countryCode: "US"
            },
            profiles: data.sections.profiles.items.map((p: any) => ({
                network: p.network,
                username: p.username,
                url: p.url.href
            }))
        },
        work: data.sections.experience.items.map((job: any) => {
            const { startDate, endDate } = parseDate(job.date);
            return {
                name: job.company,
                position: job.position,
                url: job.url?.href,
                startDate,
                endDate,
                summary: "", // We move the bullets to highlights
                highlights: extractHighlights(job.summary),
                location: job.location
            };
        }),
        education: data.sections.education.items.map((edu: any) => {
            // Education date is often just a year "2015"
            const startDate = edu.date.includes('-') ? parseDate(edu.date).startDate : `${edu.date}-01-01`;
            const endDate = edu.date.includes('-') ? parseDate(edu.date).endDate : `${edu.date}-12-31`;

            return {
                institution: edu.institution,
                url: edu.url?.href,
                area: edu.area,
                studyType: edu.studyType,
                startDate,
                endDate,
                score: edu.score,
                courses: []
            };
        }),
        skills: data.sections.skills.items.map((skill: any) => ({
            name: skill.name,
            level: "Master", // Inferred
            keywords: skill.keywords
        })),
        certificates: data.sections.certifications.items.map((cert: any) => ({
            name: cert.name,
            date: parseDate(cert.date).startDate,
            issuer: cert.issuer
        })),
        projects: data.sections.accomplishments.items.map((ack: any) => ({
            name: ack.name,
            description: "Major strategic initiative or operational achievement.", // Generic description as the real content is in highlights
            highlights: extractHighlights(ack.summary),
            type: "Accomplishment"
        })),
        meta: {
            canonical: "https://chris.melson.us/cv.json",
            version: "v1.0.0",
            lastModified: new Date().toISOString()
        }
    };

    return NextResponse.json(jsonResume);
}
