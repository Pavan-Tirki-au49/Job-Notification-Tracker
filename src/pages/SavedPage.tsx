import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bookmark, CheckCircle } from 'lucide-react';
import type { Job, JobStatus } from '../types/job';
import { JobCard } from '../components/jobs/JobCard';
import { JobDetailModal } from '../components/jobs/JobDetailModal';
import { useNavigate } from 'react-router-dom';
import { useJobStatus } from '../hooks/useJobStatus';

export const SavedPage: React.FC = () => {
    const [savedJobs, setSavedJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { updateStatus, getStatus } = useJobStatus();
    const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

    // Load Saved Jobs on Mount
    useEffect(() => {
        const saved = localStorage.getItem('savedJobs');
        if (saved) {
            setSavedJobs(JSON.parse(saved));
        }
        setIsLoading(false);
    }, []);

    const handleSave = (job: Job) => {
        // Only way to toggle here is to un-save
        const newSaved = savedJobs.filter(s => s.id !== job.id);
        setSavedJobs(newSaved);
        localStorage.setItem('savedJobs', JSON.stringify(newSaved));
    };

    const handleStatusChange = (jobId: string, status: JobStatus) => {
        updateStatus(jobId, status);
        setToast({ show: true, message: `Status updated: ${status}` });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300 relative">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Saved Opportunities</h1>

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-24 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 animate-in slide-in-from-right duration-300">
                    <CheckCircle size={18} className="text-green-400" />
                    <span className="text-sm font-medium">{toast.message}</span>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-lg"></div>)}
                </div>
            ) : savedJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedJobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            isSaved={true}
                            onSave={handleSave}
                            onView={(j) => setSelectedJob(j)}
                            onApply={(url) => window.open(url, '_blank')}
                            status={getStatus(job.id)}
                            onStatusChange={(s) => handleStatusChange(job.id, s)}
                        />
                    ))}
                </div>
            ) : (
                <Card className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
                    <div className="mb-4 text-gray-400">
                        <Bookmark size={48} />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Nothing saved yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-6">
                        Bookmark interesting jobs from your dashboard to review them here.
                    </p>
                    <Button label="Go to Dashboard" variant="primary" size="md" onClick={() => navigate('/dashboard')} />
                </Card>
            )}

            {selectedJob && (
                <JobDetailModal
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                    onApply={(url) => window.open(url, '_blank')}
                    onSave={handleSave}
                    isSaved={true}
                />
            )}
        </div>
    );
};
