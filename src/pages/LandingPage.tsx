import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-500">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight max-w-3xl">
                Stop Missing The Right Jobs.
            </h1>
            <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-2xl leading-relaxed">
                Precision-matched job discovery delivered daily at 9AM.
                <br />
                No noise, just signal.
            </p>
            <div className="flex gap-4">
                <Button
                    label="Start Tracking"
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/settings')}
                    icon={<ArrowRight size={18} />}
                />
            </div>
        </div>
    );
};
