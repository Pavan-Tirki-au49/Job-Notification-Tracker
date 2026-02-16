import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Rocket, Lock, CheckCircle, Truck, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShipPage: React.FC = () => {
    const [isComplete, setIsComplete] = useState(false);
    const [isDeployed, setIsDeployed] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('jobTrackerTestStatus');
        if (saved) {
            const checks = JSON.parse(saved);
            const passed = Object.values(checks).filter(Boolean).length;
            if (passed === 10) { // Should match checklist item count
                setIsComplete(true);
            }
        }
    }, []);

    const handleDeploy = () => {
        if (confirm('Are you sure you want to deploy Version 1.0.0 to Production?')) {
            setIsDeployed(true);
        }
    };

    if (!isComplete) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-300">
                <div className="bg-red-50 p-6 rounded-full mb-6 relative">
                    <Lock size={64} className="text-red-500" />
                    <div className="absolute -top-1 -right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono">!</div>
                </div>
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Launch Locked</h1>
                <p className="text-gray-500 max-w-sm mb-8">
                    You cannot ship this version until all tests have passed in the pre-launch checklist.
                </p>
                <Link to="/jt/07-test">
                    <Button label="Return to Checklist" variant="secondary" size="md" icon={<CheckCircle size={16} />} />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto text-center py-12 animate-in fade-in zoom-in duration-500 relative">
            <div className="mb-8 flex justify-center">
                <div className="bg-green-50 p-6 rounded-full ring-8 ring-green-50/50">
                    <Rocket size={64} className="text-green-500" />
                </div>
            </div>

            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4 tracking-tight">Ready for Liftoff</h1>
            <p className="text-xl text-gray-500 mb-12 max-w-lg mx-auto leading-relaxed">
                All systems generate green. The Job Notification Tracker v1.0 is verified and ready for deployment.
            </p>

            {isDeployed ? (
                <Card className="max-w-md mx-auto p-8 border-green-200 bg-green-50 shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle size={48} className="text-green-600" />
                        <div>
                            <h3 className="text-xl font-bold text-green-900">Deployment Successful</h3>
                            <p className="text-green-700 text-sm mt-1">Version 1.0.0 is now live.</p>
                        </div>
                        <div className="w-full bg-green-200 h-1 rounded-full mt-2 mb-2">
                            <div className="h-full bg-green-500 rounded-full w-full animate-pulse"></div>
                        </div>
                        <Button
                            label="Return to Dashboard"
                            variant="primary"
                            size="sm"
                            onClick={() => window.location.href = '/dashboard'}
                        />
                    </div>
                </Card>
            ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        label="Deploy Version 1.0.0 (Simulated)"
                        variant="primary"
                        size="md"
                        icon={<Truck size={20} />}
                        onClick={handleDeploy}
                        className="shadow-xl shadow-accent/20 hover:shadow-accent/40 transform hover:-translate-y-1 transition-all duration-300"
                    />
                    <Button
                        label="Share Release Notes"
                        variant="secondary"
                        size="md"
                        icon={<Share2 size={20} />}
                        onClick={() => alert('Release notes shared!')}
                    />
                </div>
            )}

            <p className="mt-12 text-xs text-gray-400 font-mono">BUILD_ID: {new Date().getTime().toString(36).toUpperCase()}</p>
        </div>
    );
};
