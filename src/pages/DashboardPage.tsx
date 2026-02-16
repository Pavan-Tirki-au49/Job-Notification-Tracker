import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { JobCard } from '../components/jobs/JobCard';
import { FilterBar } from '../components/jobs/FilterBar';
import { JobDetailModal } from '../components/jobs/JobDetailModal';
import { jobData } from '../data/jobs';
import type { Job, UserPreferences, JobStatus } from '../types/job';
import { calculateMatchScore } from '../utils/scoring';
import { RefreshCw, Filter, Sparkles, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useJobStatus } from '../hooks/useJobStatus';

type JobWithScore = Job & { matchScore?: number };

export const DashboardPage: React.FC = () => {
    const [savedJobs, setSavedJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [filteredJobs, setFilteredJobs] = useState<JobWithScore[]>(jobData);
    const [isLoading, setIsLoading] = useState(false);

    // Status Logic
    const { statuses, updateStatus, getStatus } = useJobStatus();
    const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

    // Preferences State
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [showMatchesOnly, setShowMatchesOnly] = useState(false);

    // Filter State
    const [currentFilters, setCurrentFilters] = useState<any>({ sort: 'Latest', status: 'All' });

    useEffect(() => {
        // Load saved jobs
        const saved = localStorage.getItem('savedJobs');
        if (saved) {
            setSavedJobs(JSON.parse(saved));
        }

        // Load preferences
        const prefs = localStorage.getItem('jobTrackerPreferences');
        if (prefs) {
            setPreferences(JSON.parse(prefs));
        }
    }, []);

    // Re-run filters when dependencies change
    useEffect(() => {
        handleFilterChange(currentFilters);
    }, [showMatchesOnly, preferences, statuses]);

    const handleApply = (url: string) => {
        window.open(url, '_blank');
    };

    const handleSave = (job: Job) => {
        const isAlreadySaved = savedJobs.some(s => s.id === job.id);
        let newSaved;
        if (isAlreadySaved) {
            newSaved = savedJobs.filter(s => s.id !== job.id);
        } else {
            newSaved = [...savedJobs, job];
        }
        setSavedJobs(newSaved);
        localStorage.setItem('savedJobs', JSON.stringify(newSaved));
    };

    const handleStatusChange = (jobId: string, status: JobStatus) => {
        updateStatus(jobId, status);
        setToast({ show: true, message: `Status updated: ${status}` });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const handleFilterChange = (filters: any) => {
        setIsLoading(true);
        setTimeout(() => {
            // 1. Start with all jobs
            let result: JobWithScore[] = [...jobData];

            // 2. Calculate scores if preferences exist
            if (preferences) {
                result = result.map(job => ({
                    ...job,
                    matchScore: calculateMatchScore(job, preferences)
                }));
            }

            // 3. Filter Logic (Standard)
            if (filters.search) {
                const q = filters.search.toLowerCase();
                result = result.filter(j =>
                    j.title.toLowerCase().includes(q) ||
                    j.company.toLowerCase().includes(q) ||
                    j.skills.some(s => s.toLowerCase().includes(q))
                );
            }

            if (filters.location && filters.location !== 'All') {
                result = result.filter(j => j.location === filters.location);
            }

            if (filters.mode && filters.mode !== 'All') {
                result = result.filter(j => j.mode === filters.mode);
            }

            if (filters.experience && filters.experience !== 'All') {
                result = result.filter(j => j.experience === filters.experience);
            }

            if (filters.source && filters.source !== 'All') {
                result = result.filter(j => j.source === filters.source);
            }

            if (filters.status && filters.status !== 'All') {
                result = result.filter(j => {
                    const s = statuses[j.id]?.status || 'Not Applied';
                    return s === filters.status;
                });
            }

            // 4. Filter Logic (Matches Only)
            if (showMatchesOnly && preferences) {
                result = result.filter(j => (j.matchScore || 0) >= preferences.minMatchScore);
            }

            // 5. Sorting Logic
            if (filters.sort === 'Match Score') {
                result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
            } else if (filters.sort === 'Salary') {
                // Heuristic sort: extract first number
                const extractSalary = (s: string) => {
                    const match = s.match(/(\d+)/);
                    return match ? parseInt(match[0]) : 0;
                };
                result.sort((a, b) => extractSalary(b.salaryRange) - extractSalary(a.salaryRange));
            } else if (filters.sort === 'Oldest') {
                result.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
            } else {
                // Default: Latest
                result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
            }

            setFilteredJobs(result);
            setIsLoading(false);
        }, 300); // Shorter delay for snappier feel
    };

    const onFilterChangeWrapper = (f: any) => {
        setCurrentFilters(f);
        // handleFilterChange called via effect
    };


    return (
        <>
            <div className="space-y-6 animate-in fade-in zoom-in duration-300 relative">
                {/* Toast Notification */}
                {toast.show && (
                    <div className="fixed top-24 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 animate-in slide-in-from-right duration-300">
                        <CheckCircle size={18} className="text-green-400" />
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">Job Feed</h1>
                        <p className="text-sm text-gray-500">
                            Updated daily at 9:00 AM. Showing {filteredJobs.length} opportunities
                            {showMatchesOnly ? ' matching your profile' : ''}.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {preferences ? (
                            <button
                                onClick={() => setShowMatchesOnly(!showMatchesOnly)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-sm font-medium ${showMatchesOnly
                                    ? 'bg-accent/10 border-accent text-accent'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                            >
                                <Sparkles size={16} className={showMatchesOnly ? "fill-accent" : ""} />
                                {showMatchesOnly ? "Showing Top Matches" : "Show Matches Only"}
                            </button>
                        ) : (
                            <Link to="/settings" className="text-xs text-accent underline hover:text-accent/80">
                                Set Preferences for Matching
                            </Link>
                        )}

                        <Button
                            variant="secondary"
                            label="Refresh"
                            icon={<RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />}
                            onClick={() => handleFilterChange(currentFilters)}
                        />
                    </div>
                </div>

                {!preferences && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-blue-900">Get Personalized Matches</h3>
                                <p className="text-xs text-blue-700 mt-1">Set your profile preferences to see job match scores and recommendations.</p>
                            </div>
                        </div>
                        <Link to="/settings">
                            <Button label="Set Preferences" variant="primary" size="sm" />
                        </Link>
                    </div>
                )}

                <FilterBar onFilterChange={onFilterChangeWrapper} />

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-gray-100 rounded-lg"></div>
                        ))}
                    </div>
                ) : filteredJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map(job => (
                            <JobCard
                                key={job.id}
                                job={job}
                                isSaved={savedJobs.some(s => s.id === job.id)}
                                onSave={handleSave}
                                onView={(j) => setSelectedJob(j)}
                                onApply={handleApply}
                                matchScore={job.matchScore}
                                status={getStatus(job.id)}
                                onStatusChange={(s) => handleStatusChange(job.id, s)}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
                        <div className="mb-4 text-gray-400">
                            <Filter size={48} />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-6">
                            {showMatchesOnly
                                ? "No jobs meet your minimum match threshold. Try lowering the threshold in Settings or viewing all jobs."
                                : "Try adjusting your filters or search query to find more results."}
                        </p>
                        {showMatchesOnly && (
                            <Button label="View All Jobs" variant="secondary" size="md" onClick={() => setShowMatchesOnly(false)} className="mr-2" />
                        )}
                        <Button label="Clear Filters" variant="secondary" size="md" onClick={() => onFilterChangeWrapper({ sort: 'Latest', status: 'All' })} />
                    </Card>
                )}
            </div>

            {selectedJob && (
                <JobDetailModal
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                    onApply={handleApply}
                    onSave={handleSave}
                    isSaved={savedJobs.some(s => s.id === selectedJob.id)}
                />
            )}
        </>
    );
};
