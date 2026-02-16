import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, Clock, Link as LinkIcon, ExternalLink, ShieldCheck, Copy, Terminal, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface ProofLinks {
    lovable: string;
    github: string;
    deploy: string;
}

export const ProofPage: React.FC = () => {
    const [links, setLinks] = useState<ProofLinks>({ lovable: '', github: '', deploy: '' });
    const [testStatus, setTestStatus] = useState({ passed: 0, total: 10 });
    const [steps, setSteps] = useState<boolean[]>(new Array(8).fill(false));
    const [isShipped, setIsShipped] = useState(false);

    useEffect(() => {
        // Load Links
        const savedLinks = localStorage.getItem('jobTrackerProofLinks');
        if (savedLinks) setLinks(JSON.parse(savedLinks));

        // specific checks
        const prefs = !!localStorage.getItem('jobTrackerPreferences');

        // Test Status
        const checklist = localStorage.getItem('jobTrackerTestStatus');
        let passedTests = 0;
        if (checklist) {
            const checks = JSON.parse(checklist);
            passedTests = Object.values(checks).filter(Boolean).length;
        }
        setTestStatus({ passed: passedTests, total: 10 });
        const allTestsPassed = passedTests === 10;

        // Step 8 & Ship Status
        const validLinks = Object.values(links).every(l => l.startsWith('http')); // Simple validation
        const readyToShip = allTestsPassed && validLinks;

        const finalSteps = [
            true, // Landing
            true, // Dashboard
            prefs,
            true, // Saved
            prefs, // Digest
            true, // Status
            allTestsPassed,
            readyToShip
        ];

        setSteps(finalSteps);
        setIsShipped(readyToShip);

    }, [links]);

    const handleLinkChange = (key: keyof ProofLinks, value: string) => {
        const newLinks = { ...links, [key]: value };
        setLinks(newLinks);
        localStorage.setItem('jobTrackerProofLinks', JSON.stringify(newLinks));
    };

    const copySubmission = () => {
        const text = `
------------------------------------------
Job Notification Tracker — Final Submission

Lovable Project:
${links.lovable}

GitHub Repository:
${links.github}

Live Deployment:
${links.deploy}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced
------------------------------------------
`.trim();
        navigator.clipboard.writeText(text);
        alert('Submission copied to clipboard!');
    };

    const STEP_NAMES = [
        "Landing Page UI",
        "Dashboard Logic",
        "Settings Persistence",
        "Saved Jobs Feature",
        "Daily Digest Engine",
        "Status & Notifications",
        "Automated Tests",
        "Ship Validation"
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300 pb-12">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Project 1 — Job Notification Tracker</h1>
                    <p className="text-gray-500">Validation and Proof of Work</p>
                </div>

                <div className={clsx("px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2",
                    isShipped ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                )}>
                    {isShipped ? <ShieldCheck size={18} /> : <Clock size={18} />}
                    {isShipped ? "Shipped" : "In Progress"}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Section A: Step Completion Summary */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Terminal size={20} className="text-gray-400" />
                        Step Completion Summary
                    </h3>
                    <div className="space-y-3">
                        {STEP_NAMES.map((name, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
                                <span className="text-sm font-medium text-gray-700">{i + 1}. {name}</span>
                                {steps[i] ? (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                        <CheckCircle size={14} /> Completed
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                        <Clock size={14} /> Pending
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {!steps[6] && (
                        <div className="mt-6 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-100 flex items-start gap-2">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <div>
                                <span className="font-bold">Tests Incomplete:</span> Only {testStatus.passed}/{testStatus.total} passed.
                                <br />
                                Run automated tests in <a href="/jt/07-test" className="underline">/jt/07-test</a>.
                            </div>
                        </div>
                    )}
                </Card>

                {/* Section B: Artifact Collection */}
                <Card className="p-6 flex flex-col h-full">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <LinkIcon size={20} className="text-gray-400" />
                        Artifact Collection
                    </h3>

                    <div className="space-y-4 flex-1">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lovable Project Link</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                                    placeholder="https://lovable.dev/..."
                                    value={links.lovable}
                                    onChange={(e) => handleLinkChange('lovable', e.target.value)}
                                />
                                <ExternalLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">GitHub Repository Link</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                                    placeholder="https://github.com/..."
                                    value={links.github}
                                    onChange={(e) => handleLinkChange('github', e.target.value)}
                                />
                                <ExternalLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deployed URL</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                                    placeholder="https://vercel.app/..."
                                    value={links.deploy}
                                    onChange={(e) => handleLinkChange('deploy', e.target.value)}
                                />
                                <ExternalLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        {isShipped ? (
                            <div className="space-y-4">
                                <div className="p-3 bg-green-50 text-green-800 text-sm font-medium rounded flex items-center justify-center gap-2 animate-in fade-in">
                                    <ShieldCheck size={18} />
                                    Project 1 Shipped Successfully.
                                </div>
                                <Button
                                    label="Copy Final Submission"
                                    variant="primary"
                                    size="md"
                                    className="w-full"
                                    icon={<Copy size={16} />}
                                    onClick={copySubmission}
                                />
                            </div>
                        ) : (
                            <Button
                                label="Complete Steps to Ship"
                                variant="secondary"
                                size="md"
                                disabled
                                className="w-full opacity-50 cursor-not-allowed"
                            />
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};
