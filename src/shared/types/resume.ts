export interface ResumeProfile {
    label: string;
    href: string;
}

export interface ResumeBasics {
    name: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    url: ResumeProfile;
    customFields: any[];
    picture: {
        url: string;
        size: number;
        aspectRatio: number;
        borderRadius: number;
        effects: {
            hidden: boolean;
            border: boolean;
            grayscale: boolean;
        };
    };
}

export interface ResumeItem {
    id: string;
    visible: boolean;
    name?: string;
    institution?: string;
    company?: string;
    studyType?: string;
    area?: string;
    position?: string;
    score?: string;
    date: string;
    location?: string;
    summary: string;
    url: ResumeProfile;
    description?: string; // For skills
    keywords?: string[]; // For skills
    level?: number; // For skills
    issuer?: string; // For certifications
}

export interface ResumeSection<T = ResumeItem> {
    name: string;
    columns: number;
    separateLinks: boolean;
    visible: boolean;
    id: string;
    content?: string; // For summary
    items: T[]; // Use generic T for items to allow structural variations if needed
}

export interface ResumeSkillCategory extends ResumeSection<ResumeItem> { }

export interface ResumeData {
    basics: ResumeBasics;
    sections: {
        summary: ResumeSection;
        awards: ResumeSection;
        certifications: ResumeSection;
        education: ResumeSection;
        experience: ResumeSection;
        volunteer: ResumeSection;
        interests: ResumeSection;
        languages: ResumeSection;
        profiles: ResumeSection;
        projects: ResumeSection;
        publications: ResumeSection;
        references: ResumeSection;
        skills: {
            name: string;
            columns: number;
            separateLinks: boolean;
            visible: boolean;
            id: string;
            items: ResumeItem[];
        } // The skills section seems to have 'items' directly in 'skills' from the json in usage in ServerSideResume, but in JSON it is under 'sections.skills'.
        // Wait, in JSON: "sections": { "skills": { "items": [] } }
        // So it works like other sections.
    };
    metadata: {
        template: string;
        layout: any[];
        css: any;
        page: any;
        theme: any;
        typography: any;
        notes: string;
    };
}
