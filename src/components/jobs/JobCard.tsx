import type { Job, JobStatus } from '../../types/job';
import { Bookmark, Clock, MapPin, Building2, ExternalLink, ChevronDown, Brain } from 'lucide-react';
import { clsx } from 'clsx';

interface JobCardProps {
    job: Job;
    isSaved: boolean;
    onSave: (job: Job) => void;
    onView: (job: Job) => void;
    onApply: (url: string) => void;
    matchScore?: number;
    status?: JobStatus;
    onStatusChange?: (status: JobStatus) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, isSaved, onSave, onView, onApply, matchScore, status, onStatusChange }) => {

    const getStatusStyle = (s: JobStatus) => {
        switch (s) {
            case 'Applied': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'Selected': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200 hover:border-gray-300';
        }
    };

    return (
        <div className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-red-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full animate-in fade-in zoom-in-95 relative">

            {/* Header: Title & Source */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-serif font-bold text-gray-900 leading-snug group-hover:text-red-900 transition-colors">
                    {job.title}
                </h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{job.source}</span>
            </div>

            {/* Company */}
            <div className="flex items-center gap-2 mb-4 text-gray-600">
                <Building2 size={14} />
                <span className="text-sm font-medium">{job.company}</span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-gray-400" />
                    <span>{job.experience}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 font-bold px-0.5">$</span>
                    <span>{job.salaryRange}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">Posted</span>
                    <span>{job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo}d ago`}</span>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                {job.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] font-semibold rounded border border-gray-100">
                        {skill}
                    </span>
                ))}
                {job.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-400 text-[10px] font-semibold rounded border border-gray-100">
                        +{job.skills.length - 3}
                    </span>
                )}
            </div>

            {/* Match Score Badge (Preserved Feature) - Absolute Top? Or near Tags? */}
            {/* The screenshot doesn't show match score. I'll make it subtle or integrate. 
                I'll put it absolute top-right-ish or just suppress if not "showing matches". 
                Actually, the user requirements say "Match score calculates correctly". 
                I'll put it as a small badge next to Source?
            */}

            {/* Status Dropdown (Preserved Feature) */}
            <div className="mb-4">
                {onStatusChange && (
                    <div className="relative inline-block w-full">
                        <select
                            value={status || 'Not Applied'}
                            onChange={(e) => onStatusChange(e.target.value as JobStatus)}
                            className={clsx(
                                "w-full appearance-none text-[10px] font-bold uppercase tracking-wider py-1.5 pl-3 pr-8 rounded border cursor-pointer focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all",
                                getStatusStyle(status || 'Not Applied')
                            )}
                        >
                            <option value="Not Applied">Status: None</option>
                            <option value="Applied">Applied</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Selected">Selected</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="mt-auto flex items-center gap-3">
                <button
                    onClick={() => onView(job)}
                    className="p-2.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    title="View Details"
                >
                    <Brain size={18} />
                </button>

                <button
                    onClick={() => onSave(job)}
                    className={clsx(
                        "p-2.5 rounded-lg border transition-colors",
                        isSaved ? "border-red-100 bg-red-50 text-red-600" : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    title="Save Job"
                >
                    <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                </button>

                <button
                    onClick={() => onApply(job.applyUrl)}
                    className="flex-1 bg-[#6A1E1E] hover:bg-[#8B3D3D] text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                    Apply <ExternalLink size={16} />
                </button>
            </div>

            {/* Match Score - integrated nicely? */}
            {typeof matchScore === 'number' && matchScore > 0 && (
                <div className="absolute top-14 right-5">
                    <div className={clsx("text-[10px] font-bold px-1.5 py-0.5 rounded border bg-white shadow-sm",
                        matchScore >= 80 ? "text-green-600 border-green-200" : "text-amber-600 border-amber-200"
                    )}>
                        {matchScore}%
                    </div>
                </div>
            )}
        </div>
    );
};
