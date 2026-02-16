import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { JobExperience, JobMode, JobSource } from '../../types/job';


interface FilterState {
    search: string;
    location: string;
    mode: JobMode | 'All';
    experience: JobExperience | 'All';
    source: JobSource | 'All';
    sort: 'Latest' | 'Oldest' | 'Match Score' | 'Salary';
    status?: 'All' | 'Not Applied' | 'Applied' | 'Rejected' | 'Selected';
}

interface FilterBarProps {
    onFilterChange: (filters: FilterState) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        location: 'All',
        mode: 'All',
        experience: 'All',
        source: 'All',
        sort: 'Latest',
        status: 'All'
    });

    const handleChange = (key: keyof FilterState, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search role, company or skills..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-sans text-sm"
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                    />
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap gap-2">
                    <select
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:border-accent cursor-pointer"
                        value={filters.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Not Applied">Not Applied</option>
                        <option value="Applied">Applied</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Selected">Selected</option>
                    </select>
                    <select
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:border-accent cursor-pointer"
                        value={filters.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                    >
                        <option value="All">All Locations</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Remote">Remote</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Pune">Pune</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Gurugram">Gurugram</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Noida">Noida</option>
                    </select>

                    <select
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:border-accent cursor-pointer"
                        value={filters.mode}
                        onChange={(e) => handleChange('mode', e.target.value)}
                    >
                        <option value="All">All Modes</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Onsite">Onsite</option>
                    </select>

                    <select
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:border-accent cursor-pointer"
                        value={filters.experience}
                        onChange={(e) => handleChange('experience', e.target.value)}
                    >
                        <option value="All">All Experience</option>
                        <option value="Fresher">Fresher</option>
                        <option value="0-1 Years">0-1 Years</option>
                        <option value="1-3 Years">1-3 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                    </select>

                    <select
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:border-accent cursor-pointer"
                        value={filters.source}
                        onChange={(e) => handleChange('source', e.target.value)}
                    >
                        <option value="All">All Sources</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Naukri">Naukri</option>
                        <option value="Indeed">Indeed</option>
                        <option value="Company Site">Company Site</option>
                        <option value="Instahyre">Instahyre</option>
                        <option value="AngelList">AngelList</option>
                        <option value="TCS iBegin">TCS iBegin</option>
                        <option value="Internshala">Internshala</option>
                    </select>

                    <select
                        className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700 focus:outline-none focus:border-accent cursor-pointer font-medium"
                        value={filters.sort}
                        onChange={(e) => handleChange('sort', e.target.value)}
                        style={{ width: '140px' }} // Fixed width for sort
                    >
                        <option value="Latest">Latest First</option>
                        <option value="Oldest">Oldest First</option>
                        <option value="Match Score">Match Score</option>
                        <option value="Salary">Salary High-Low</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
