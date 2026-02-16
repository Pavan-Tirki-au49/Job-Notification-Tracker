import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, Circle, Rocket, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

interface TestItem {
    id: string;
    label: string;
    description: string;
}

const TEST_ITEMS: TestItem[] = [
    { id: 'prefs_persist', label: 'Preferences persist after refresh', description: 'Set preferences in /settings and reload the page. Verify they remain.' },
    { id: 'match_score', label: 'Match score calculates correctly', description: 'Check ifjob cards show a % match score based on your settings.' },
    { id: 'matches_toggle', label: '"Show only matches" toggle works', description: 'On dashboard, toggle "Show Matches Only". Ensure only qualified jobs appear.' },
    { id: 'save_persist', label: 'Save job persists after refresh', description: 'Save a job, reload, and verify it is still saved.' },
    { id: 'apply_new_tab', label: 'Apply opens in new tab', description: 'Click Apply on any job. It should open a new browser tab.' },
    { id: 'status_persist', label: 'Status update persists after refresh', description: 'Change status to Applied, reload, and verify persistence.' },
    { id: 'status_filter', label: 'Status filter works correctly', description: 'Filter by "Applied" status and verify correct jobs are shown.' },
    { id: 'digest_top10', label: 'Digest generates top 10 by score', description: 'Generate digest and count the items. Check ordering.' },
    { id: 'digest_persist', label: 'Digest persists for the day', description: 'Reload /digest page. The same digest should appear without regenerating.' },
    { id: 'no_console_errors', label: 'No console errors on main pages', description: 'Open DevTools (F12) and check Console for red errors.' },
];

export const TestChecklistPage: React.FC = () => {
    const [checks, setChecks] = useState<{ [key: string]: boolean }>({});
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem('jobTrackerTestStatus');
        if (saved) {
            setChecks(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        const completed = Object.values(checks).filter(Boolean).length;
        setProgress((completed / TEST_ITEMS.length) * 100);
        localStorage.setItem('jobTrackerTestStatus', JSON.stringify(checks));
    }, [checks]);

    const toggleCheck = (id: string) => {
        setChecks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const resetTests = () => {
        if (confirm('Reset all test progress?')) {
            setChecks({});
        }
    };

    const isComplete = progress === 100;

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300 pb-12">
            <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Pre-Launch Checklist</h1>
                <p className="text-gray-500">Verify all system functions before shipping Version 1.0.</p>
            </div>

            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className={clsx("text-2xl font-mono", isComplete ? "text-green-600" : "text-gray-900")}>
                                {Object.values(checks).filter(Boolean).length} / {TEST_ITEMS.length}
                            </span>
                            <span className="text-sm font-normal text-gray-500">Tests Passed</span>
                        </h2>
                    </div>
                    {/* Status Badge */}
                    <div className={clsx("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                        isComplete ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    )}>
                        {isComplete ? "Ready to Ship" : "Testing in Progress"}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6 overflow-hidden">
                    <div
                        className={clsx("h-2.5 rounded-full transition-all duration-500", isComplete ? "bg-green-500" : "bg-accent")}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Checklist */}
                <div className="space-y-3">
                    {TEST_ITEMS.map((item) => (
                        <div
                            key={item.id}
                            className={clsx(
                                "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-gray-50",
                                checks[item.id] ? "bg-green-50/50 border-green-100" : "bg-white border-gray-100"
                            )}
                            onClick={() => toggleCheck(item.id)}
                        >
                            <div className={clsx("mt-0.5 transition-colors", checks[item.id] ? "text-green-500" : "text-gray-300")}>
                                {checks[item.id] ? <CheckCircle size={20} fill="currentColor" className="text-green-100" /> : <Circle size={20} />}
                            </div>
                            <div className="flex-1">
                                <h3 className={clsx("font-medium text-sm transition-colors", checks[item.id] ? "text-gray-700 line-through decoration-gray-300" : "text-gray-900")}>
                                    {item.label}
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                    <button
                        onClick={resetTests}
                        className="text-xs text-gray-400 hover:text-red-500 underline transition-colors"
                    >
                        Reset Test Status
                    </button>

                    <div>
                        {isComplete ? (
                            <Link to="/jt/08-ship">
                                <Button
                                    label="Proceed to Ship"
                                    variant="primary"
                                    size="md"
                                    icon={<Rocket size={16} />}
                                    className="animate-pulse"
                                />
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded text-xs font-medium border border-amber-100 cursor-not-allowed opacity-75 grayscale">
                                <Lock size={14} />
                                <span>Resolve all issues before shipping</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};
