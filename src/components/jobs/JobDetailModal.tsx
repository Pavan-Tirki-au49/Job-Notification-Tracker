import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Job } from '../../types/job';
import { X, Globe } from 'lucide-react';
import { Button } from '../ui/Button';

interface JobDetailModalProps {
    job: Job | null;
    onClose: () => void;
    onApply: (url: string) => void;
    onSave: (job: Job) => void;
    isSaved: boolean;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose, onApply, onSave, isSaved }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!job) return null;

    console.log('Rendering JobDetailModal via Portal for:', job.title);

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Fixed Header */}
                <div className="flex-none bg-white border-b border-gray-100 p-6 flex justify-between items-start z-10 rounded-t-lg">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">{job.title}</h2>
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                            <span className="bg-gray-100 px-2 py-1 rounded">{job.company}</span>
                            <span className="text-gray-300">•</span>
                            <span>{job.location} ({job.mode})</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 rounded border border-gray-100">
                            <span className="block text-xs text-gray-500 uppercase font-semibold mb-1">Experience</span>
                            <span className="font-medium text-gray-900">{job.experience}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded border border-gray-100">
                            <span className="block text-xs text-gray-500 uppercase font-semibold mb-1">Salary</span>
                            <span className="font-medium text-gray-900">{job.salaryRange}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold font-serif mb-2 text-gray-900">About the Role</h3>
                        <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                            {job.description || "No description provided."}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold font-sans uppercase text-gray-500 mb-3 tracking-wider">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {(job.skills && job.skills.length > 0) ? job.skills.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium shadow-sm">
                                    {skill}
                                </span>
                            )) : (
                                <span className="text-gray-400 italic">No specific skills listed.</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400 pt-4 border-t border-gray-100">
                        <Globe size={14} />
                        <span>Sourced from {job.source}</span>
                        <span>•</span>
                        <span>Posted {job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo} days ago`}</span>
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="flex-none bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3 rounded-b-lg">
                    <Button
                        variant="secondary"
                        label={isSaved ? "Saved" : "Save for Later"}
                        onClick={() => onSave(job)}
                        disabled={isSaved}
                    />
                    <Button
                        variant="primary"
                        label="Apply Now"
                        onClick={() => onApply(job.applyUrl)}
                    />
                </div>
            </div>
        </div>,
        document.body
    );
};
