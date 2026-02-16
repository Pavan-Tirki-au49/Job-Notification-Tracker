export type JobMode = 'Remote' | 'Hybrid' | 'Onsite';
export type JobExperience = 'Fresher' | '0-1 Years' | '1-3 Years' | '3-5 Years';
export type JobSource = 'LinkedIn' | 'Naukri' | 'Indeed' | 'Company Site' | 'Instahyre' | 'AngelList' | 'TCS iBegin' | 'Internshala';

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    mode: JobMode;
    experience: JobExperience;
    skills: string[];
    source: JobSource;
    postedDaysAgo: number;
    salaryRange: string;
    applyUrl: string;
    description: string;
    logo?: string; // Optional URL for company logo placeholder
}

export interface UserPreferences {
    roleKeywords: string[];
    preferredLocations: string[];
    preferredMode: JobMode[];
    experienceLevel: string; // Single selection from dropdown as per requirement
    skills: string[];
    minMatchScore: number;
}

export type JobStatus = 'Not Applied' | 'Applied' | 'Rejected' | 'Selected';

export interface StatusRecord {
    status: JobStatus;
    updatedAt: string; // ISO Date string
}

export interface JobToStatusMap {
    [jobId: string]: StatusRecord;
}
