import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Save } from 'lucide-react';
import type { UserPreferences } from '../types/job';

export const SettingsPage: React.FC = () => {
    const [preferences, setPreferences] = useState<UserPreferences>({
        roleKeywords: [],
        preferredLocations: [],
        preferredMode: [],
        experienceLevel: 'Fresher',
        skills: [],
        minMatchScore: 40
    });

    const [rawKeywords, setRawKeywords] = useState('');
    const [rawLocations, setRawLocations] = useState('');
    const [rawSkills, setRawSkills] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('jobTrackerPreferences');
        if (saved) {
            const parsed = JSON.parse(saved);
            setPreferences(parsed);
            setRawKeywords(parsed.roleKeywords.join(', '));
            setRawLocations(parsed.preferredLocations.join(', '));
            setRawSkills(parsed.skills.join(', '));
        }
    }, []);

    const handleSave = () => {
        const newPreferences: UserPreferences = {
            ...preferences,
            roleKeywords: rawKeywords.split(',').map(s => s.trim()).filter(Boolean),
            preferredLocations: rawLocations.split(',').map(s => s.trim()).filter(Boolean),
            skills: rawSkills.split(',').map(s => s.trim()).filter(Boolean),
        };

        localStorage.setItem('jobTrackerPreferences', JSON.stringify(newPreferences));
        setPreferences(newPreferences);
        alert('Preferences saved successfully!');
    };

    const toggleMode = (mode: 'Remote' | 'Hybrid' | 'Onsite') => {
        setPreferences(prev => {
            const newModes = prev.preferredMode.includes(mode)
                ? prev.preferredMode.filter(m => m !== mode)
                : [...prev.preferredMode, mode];
            return { ...prev, preferredMode: newModes };
        });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
            <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Preferences</h1>
                <p className="text-gray-500 text-lg">
                    Configure your intelligent matching criteria.
                </p>
            </div>

            <Card title="Job Criteria">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role Keywords</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-sans text-sm"
                            placeholder="e.g. Frontend Engineer, Product Designer (comma separated)"
                            value={rawKeywords}
                            onChange={(e) => setRawKeywords(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">Impacts match score (+25 title, +15 desc)</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Locations</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-sans text-sm"
                            placeholder="e.g. Remote, Bangalore, Pune (comma separated)"
                            value={rawLocations}
                            onChange={(e) => setRawLocations(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">Impacts match score (+15)</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Work Mode (+10)</label>
                            <div className="space-y-2">
                                {['Remote', 'Hybrid', 'Onsite'].map((mode) => (
                                    <label key={mode} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.preferredMode.includes(mode as any)}
                                            onChange={() => toggleMode(mode as any)}
                                            className="rounded border-gray-300 text-accent focus:ring-accent"
                                        />
                                        <span className="text-sm text-gray-700">{mode}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level (+10)</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-sans text-sm bg-white"
                                value={preferences.experienceLevel}
                                onChange={(e) => setPreferences({ ...preferences, experienceLevel: e.target.value })}
                            >
                                <option value="Fresher">Fresher</option>
                                <option value="0-1 Years">0-1 Years</option>
                                <option value="1-3 Years">1-3 Years</option>
                                <option value="3-5 Years">3-5 Years</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-sans text-sm min-h-[80px]"
                            placeholder="e.g. React, TypeScript, Node.js (comma separated)"
                            value={rawSkills}
                            onChange={(e) => setRawSkills(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">Impacts match score (+15 overlap)</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Minimum Match Score Threshold</label>
                            <span className="text-sm font-bold text-accent">{preferences.minMatchScore}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            className="w-full accent-accent h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            value={preferences.minMatchScore}
                            onChange={(e) => setPreferences({ ...preferences, minMatchScore: parseInt(e.target.value) })}
                        />
                        <p className="text-xs text-gray-400 mt-1">Only show jobs above this score when "Show Matches" is enabled.</p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
                    <Button variant="secondary" label="Reset Defaults" onClick={() => {
                        if (confirm('Reset all preferences?')) {
                            setPreferences({
                                roleKeywords: [],
                                preferredLocations: [],
                                preferredMode: [],
                                experienceLevel: 'Fresher',
                                skills: [],
                                minMatchScore: 40
                            });
                            setRawKeywords('');
                            setRawLocations('');
                            setRawSkills('');
                            localStorage.removeItem('jobTrackerPreferences');
                        }
                    }} />
                    <Button variant="primary" label="Save Preferences" icon={<Save size={16} />} onClick={handleSave} />
                </div>
            </Card>
        </div>
    );
};
