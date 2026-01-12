import { ResumeData, ResumeItem } from "@/shared/types/resume";

interface ServerSideResumeProps {
    data: ResumeData;
}

/**
 * ServerSideResume
 * 
 * A visually hidden component that renders the full resume data in semantic HTML.
 * This ensures that:
 * 1. SEO Crawlers (Googlebot) see relevant keywords and structure immediately.
 * 2. LLMs (Perplexity, ChatGPT) have a rich textual source of truth.
 * 3. Screen Readers have access to the core content even if dynamic UI is complex.
 * 
 * Hidden using 'sr-only' class (Tailwind) to remain accessible but invisible.
 */
export const ServerSideResume = ({ data }: ServerSideResumeProps) => {
    return (
        <article className="sr-only">
            <header>
                <h1>{data.basics.name}</h1>
                <p>{data.basics.headline}</p>
                <div dangerouslySetInnerHTML={{ __html: data.sections.summary?.content || '' }} />
            </header>

            <section aria-label="Experience">
                <h2>Professional Experience</h2>
                {data.sections.experience?.items?.map((job: ResumeItem, index: number) => (
                    <div key={index}>
                        <h3>{job.position} at {job.company}</h3>
                        <p>{job.date} | {job.location}</p>
                        <div dangerouslySetInnerHTML={{ __html: job.summary || '' }} />
                    </div>
                ))}
            </section>

            <section aria-label="Education">
                <h2>Education</h2>
                {data.sections.education?.items?.map((edu: ResumeItem, index: number) => (
                    <div key={index}>
                        <h3>{edu.institution}</h3>
                        <p>{edu.area}, {edu.studyType}</p>
                        <p>{edu.date}</p>
                    </div>
                ))}
            </section>

            <section aria-label="Skills">
                <h2>Skills & Expertise</h2>
                {data.sections.skills?.items?.map((skillGroup: ResumeItem, index: number) => (
                    <div key={index}>
                        <h3>{skillGroup.name}</h3>
                        <ul>
                            {skillGroup.keywords?.map((keyword: string, kIndex: number) => (
                                <li key={kIndex}>{keyword}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
        </article>
    );
};
