import type { Job, JobStatus } from '../../types/job';
import { Bookmark, Clock, MapPin, Building2, Wallet, ExternalLink, ChevronDown } from 'lucide-react';
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

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
        if (score >= 60) return 'bg-amber-100 text-amber-800 border-amber-200';
        if (score >= 40) return 'bg-gray-100 text-gray-700 border-gray-200';
        return 'bg-gray-50 text-gray-400 border-gray-100';
    };

    const getStatusStyle = (s: JobStatus) => {
        switch (s) {
            case 'Applied': return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20';
            case 'Rejected': return 'bg-red-50 text-red-700 border-red-200 ring-red-500/20';
            case 'Selected': return 'bg-green-50 text-green-700 border-green-200 ring-green-500/20';
            default: return 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300';
        }
    };

    return (
        <div
            className="group relative bg-white rounded-lg border border-gray-200 hover:border-accent hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full animate-in fade-in zoom-in-95"
        >
            {/* Card Header */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-lg font-serif font-bold text-gray-900 leading-tight mb-1 group-hover:text-accent transition-colors cursor-pointer" onClick={() => onView(job)}>
                            {job.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                            <Building2 size={14} className="text-gray-400" />
                            <span>{job.company}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        {typeof matchScore === 'number' && matchScore > 0 && (
                            <div className={clsx(
                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                                getScoreColor(matchScore)
                            )}>
                                {matchScore}% Match
                            </div>
                        )}
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 border border-gray-100">
                            <span className="text-xs font-bold">{job.company.substring(0, 2).toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                {/* Tags Row */}
                <div className="flex flex-wrap gap-2 mb-4 text-xs font-medium text-gray-600">
                    <span className="px-2 py-1 bg-gray-50 rounded border border-gray-100 flex items-center gap-1">
                        <MapPin size={12} className="text-gray-400" />
                        {job.location}
                    </span>
                    <span className="px-2 py-1 bg-gray-50 rounded border border-gray-100">
                        {job.mode}
                    </span>
                    <span className="px-2 py-1 bg-gray-50 rounded border border-gray-100 flex items-center gap-1">
                        <Wallet size={12} className="text-gray-400" />
                        {job.salaryRange}
                    </span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100">
                        {job.experience}
                    </span>
                </div>

                {/* Source & Status Row */}
                <div className="mt-auto flex justify-between items-end pt-2">
                    <span className="inline-block px-2 py-0.5 text-[10px] bg-gray-100 text-gray-500 rounded uppercase tracking-wider font-semibold h-fit">
                        Via {job.source}
                    </span>

                    {onStatusChange && (
                        <div className="relative group/status" onClick={e => e.stopPropagation()}>
                            <select
                                value={status || 'Not Applied'}
                                onChange={(e) => onStatusChange(e.target.value as JobStatus)}
                                className={clsx(
                                    "appearance-none text-[10px] font-bold uppercase tracking-wider py-1.5 pl-3 pr-7 rounded border cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all shadow-sm",
                                    getStatusStyle(status || 'Not Applied')
                                )}
                            >
                                <option value="Not Applied">Status: None</option>
                                <option value="Applied">Applied</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Selected">Selected</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                        </div>
                    )}
                </div>

            </div>

            {/* Footer / Actions */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 transition-colors group-hover:bg-gray-50/80">
                <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {job.postedDaysAgo === 0 ? <span className="text-green-600 font-medium">New Today</span> : <span>{job.postedDaysAgo}d ago</span>}
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={(e) => { e.stopPropagation(); onSave(job); }}
                        className={clsx("p-1.5 rounded hover:bg-white hover:shadow-sm transition-all", isSaved ? "text-accent" : "text-gray-400 hover:text-accent")}
                        title={isSaved ? "Saved" : "Save Job"}
                    >
                        <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                    </button>

                    <button
                        onClick={(e) => {
                            console.log('View button clicked for job:', job.id);
                            e.stopPropagation();
                            onView(job);
                        }}
                        className="h-7 px-3 text-xs bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
                    >
                        View
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onApply(job.applyUrl); }}
                        className="p-1.5 rounded hover:bg-white hover:shadow-sm text-gray-400 hover:text-accent transition-all"
                        title="Apply Now"
                    >
                        <ExternalLink size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
