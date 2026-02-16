import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Settings, Mail, Copy, RefreshCw, Sparkles, ExternalLink, Clock, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jobData } from '../data/jobs';
import type { Job, UserPreferences, JobStatus } from '../types/job';
import { calculateMatchScore } from '../utils/scoring';
import { useJobStatus } from '../hooks/useJobStatus';
import { clsx } from 'clsx';

type JobWithScore = Job & { matchScore: number };

export const DigestPage: React.FC = () => {
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [digest, setDigest] = useState<JobWithScore[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [digestDate, setDigestDate] = useState<string>('');
    const { statuses } = useJobStatus();

    const getTodayDateKey = () => {
        const d = new Date();
        return `jobTrackerDigest_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const getDisplayDate = () => {
        return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    useEffect(() => {
        // Load preferences
        const savedPrefs = localStorage.getItem('jobTrackerPreferences');
        if (savedPrefs) {
            setPreferences(JSON.parse(savedPrefs));
        }

        // Check for existing digest
        const todayKey = getTodayDateKey();
        const savedDigest = localStorage.getItem(todayKey);

        if (savedDigest) {
            setDigest(JSON.parse(savedDigest));
            setDigestDate(getDisplayDate());
        }
    }, []);

    const generateDigest = () => {
        if (!preferences) return;

        setIsLoading(true);
        setTimeout(() => {
            // 1. Calculate scores for all jobs
            const scoredJobs = jobData.map(job => ({
                ...job,
                matchScore: calculateMatchScore(job, preferences)
            }));

            // 2. Filter by minimum threshold (or at least > 0)
            const qualifiedJobs = scoredJobs.filter(j => j.matchScore >= (preferences.minMatchScore || 0));

            // 3. Sort: Match Score (Desc) -> Posted Date (Asc)
            qualifiedJobs.sort((a, b) => {
                if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
                return a.postedDaysAgo - b.postedDaysAgo;
            });

            // 4. Take top 10
            const topJobs = qualifiedJobs.slice(0, 10);

            // 5. Persist
            const todayKey = getTodayDateKey();
            localStorage.setItem(todayKey, JSON.stringify(topJobs));

            setDigest(topJobs);
            setDigestDate(getDisplayDate());
            setIsLoading(false);
        }, 800); // Simulate processing
    };

    const copyToClipboard = () => {
        if (!digest) return;

        const text = digest.map((job, i) =>
            `${i + 1}. ${job.title} at ${job.company} (${job.matchScore}% Match)\n   Location: ${job.location} | Exp: ${job.experience}\n   Apply: ${job.applyUrl}`
        ).join('\n\n');

        const header = `My 9AM Job Digest - ${digestDate}\nTop ${digest.length} Matches\n\n`;
        navigator.clipboard.writeText(header + text);
        alert('Digest copied to clipboard!');
    };

    const createEmailDraft = () => {
        if (!digest) return;

        const subject = encodeURIComponent(`My 9AM Job Digest - ${digestDate}`);

        const bodyLines = digest.map((job, i) =>
            `${i + 1}. ${job.title} at ${job.company} (${job.matchScore}% Match)%0D%0A   Location: ${job.location} | Exp: ${job.experience}%0D%0A   Link: ${job.applyUrl}`
        );

        const body = encodeURIComponent(`Here are my top job matches for today:\n\n`) + bodyLines.join('%0D%0A%0D%0A');

        window.open(`mailto:?subject=${subject}&body=${body}`);
    };

    // Helper for Status Update List
    const getRecentUpdates = () => {
        return Object.entries(statuses)
            .map(([id, record]) => {
                const job = jobData.find(j => j.id === id);
                return { ...record, job };
            })
            .filter(item => item.job)
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5);
    };

    const updates = getRecentUpdates();

    const getStatusIcon = (s: JobStatus) => {
        switch (s) {
            case 'Applied': return <CheckCircle size={14} className="text-blue-500" />;
            case 'Rejected': return <XCircle size={14} className="text-red-500" />;
            case 'Selected': return <Briefcase size={14} className="text-green-500" />;
            default: return <Clock size={14} className="text-gray-400" />;
        }
    };

    // Case 1: No Preferences Set
    if (!preferences && !isLoading) {
        return (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Daily Digest</h1>
                <Card className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
                    <div className="mb-4 text-gray-400 p-4 bg-gray-50 rounded-full">
                        <Settings size={48} />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Setup Required</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">
                        We need to know your preferences to generate a personalized job digest for you.
                    </p>
                    <Link to="/settings">
                        <Button label="Set Preferences Now" variant="primary" size="md" />
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">Daily Digest</h1>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Sparkles size={14} className="text-accent" />
                        AI-Curated Job Summary
                    </p>
                </div>

                {!digest && (
                    <Button
                        label={isLoading ? "Generating..." : "Generate Today's 9AM Digest (Simulated)"}
                        variant="primary"
                        size="md"
                        icon={<RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />}
                        onClick={generateDigest}
                        disabled={isLoading}
                    />
                )}
            </div>

            {/* Digest View */}
            {digest && (
                <div className="bg-[#f8f9fa] border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-4 duration-500">
                    {/* Email Header */}
                    <div className="bg-white border-b border-gray-200 p-8 text-center">
                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">Daily Intelligence</p>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2">Top {digest.length} Jobs For You</h2>
                        <p className="text-gray-500 text-sm">{digestDate}</p>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 md:p-8 space-y-6">
                        {digest.length > 0 ? digest.map((job, index) => (
                            <div key={job.id} className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                                        <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${job.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                                            job.matchScore >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {job.matchScore}% Match
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p><span className="font-semibold text-gray-800">{job.company}</span> • {job.location}</p>
                                        <p className="text-gray-500 text-xs">{job.experience} • Posted {job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo}d ago`}</p>
                                    </div>
                                </div>
                                <Button
                                    label="Apply"
                                    variant="secondary"
                                    size="sm"
                                    icon={<ExternalLink size={14} />}
                                    onClick={() => window.open(job.applyUrl, '_blank')}
                                />
                            </div>
                        )) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No matching roles found today based on your criteria.</p>
                                <p className="text-sm text-gray-400 mt-2">Try adjusting your preferences or checking back tomorrow.</p>
                            </div>
                        )}
                    </div>

                    {/* Email Footer */}
                    <div className="bg-gray-50 border-t border-gray-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                        <div>
                            <p className="text-xs text-gray-400">This digest was generated based on your preferences.</p>
                            <p className="text-[10px] text-gray-300 mt-1">Demo Mode: Daily 9AM trigger simulated manually.</p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                label="Copy Text"
                                variant="secondary"
                                size="sm"
                                icon={<Copy size={14} />}
                                onClick={copyToClipboard}
                            />
                            <Button
                                label="Email Draft"
                                variant="primary"
                                size="sm"
                                icon={<Mail size={14} />}
                                onClick={createEmailDraft}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Status Updates Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-gray-400" />
                    Recent Status Updates
                </h3>

                {updates.length > 0 ? (
                    <div className="space-y-4">
                        {updates.map((item) => (
                            <div key={item.job!.id} className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0 gap-2">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800">{item.job!.title}</h4>
                                    <p className="text-xs text-gray-500">{item.job!.company}</p>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-gray-50 border border-gray-100">
                                        {getStatusIcon(item.status)}
                                        <span className={clsx("text-xs font-semibold uppercase",
                                            item.status === 'Applied' && "text-blue-600",
                                            item.status === 'Rejected' && "text-red-600",
                                            item.status === 'Selected' && "text-green-600",
                                            item.status === 'Not Applied' && "text-gray-500"
                                        )}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(item.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 text-center py-4">No recent status updates recorded.</p>
                )}
            </div>
        </div>
    );
};
