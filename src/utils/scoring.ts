import type { Job, UserPreferences } from '../types/job';

export function calculateMatchScore(job: Job, prefs: UserPreferences): number {
    let score = 0;

    const jobTitle = job.title.toLowerCase();
    const jobDesc = job.description.toLowerCase();
    const jobLocation = job.location.toLowerCase();
    const jobMode = job.mode;
    const jobExp = job.experience;
    const jobSkills = job.skills.map(s => s.toLowerCase());

    // 1. Role Keyword match in title (+25) or description (+15)
    // "if any roleKeyword appears..."
    const roleKeywords = prefs.roleKeywords.map(k => k.toLowerCase().trim()).filter(k => k);
    let titleMatch = false;
    let descMatch = false;

    for (const keyword of roleKeywords) {
        if (jobTitle.includes(keyword)) titleMatch = true;
        if (jobDesc.includes(keyword)) descMatch = true;
    }

    if (titleMatch) score += 25;
    if (descMatch) score += 15;

    // 2. Location Match (+15)
    // "if job.location matches preferredLocations"
    // Assuming partial match or valid one-to-one
    const prefLocations = prefs.preferredLocations.map(l => l.toLowerCase().trim()).filter(l => l);
    if (prefLocations.some(loc => jobLocation.includes(loc) || loc.includes(jobLocation))) {
        score += 15;
    }

    // 3. Mode Match (+10)
    if (prefs.preferredMode.includes(jobMode)) {
        score += 10;
    }

    // 4. Experience Match (+10)
    // Exact string match? Or fuzzy. Given "Fresher" "0-1 Years" etc. Exact is safer for now.
    // user input is string.
    if (jobExp === prefs.experienceLevel) {
        score += 10;
    }

    // 5. Skills Overlap (+15)
    const prefSkills = prefs.skills.map(s => s.toLowerCase().trim()).filter(s => s);
    const hasSkillMatch = prefSkills.some(skill => jobSkills.some(js => js.includes(skill) || skill.includes(js)));
    if (hasSkillMatch) {
        score += 15;
    }

    // 6. Recency (+5)
    if (job.postedDaysAgo <= 2) {
        score += 5;
    }

    // 7. Source (+5)
    if (job.source === 'LinkedIn') {
        score += 5;
    }

    return Math.min(score, 100);
}
