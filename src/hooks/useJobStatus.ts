import { useState, useEffect } from 'react';
import type { JobStatus, JobToStatusMap } from '../types/job';

const STORAGE_KEY = 'jobTrackerStatus';

export const useJobStatus = () => {
    const [statuses, setStatuses] = useState<JobToStatusMap>({});

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setStatuses(JSON.parse(saved));
        }
    }, []);

    const updateStatus = (jobId: string, newStatus: JobStatus) => {
        setStatuses(prev => {
            const updated = {
                ...prev,
                [jobId]: {
                    status: newStatus,
                    updatedAt: new Date().toISOString()
                }
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const getStatus = (jobId: string): JobStatus => {
        return statuses[jobId]?.status || 'Not Applied';
    };

    return { statuses, updateStatus, getStatus };
};
