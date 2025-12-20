/**
 * Welcome Modal
 * Shown on first login before tour starts
 */
import React, { useState, useEffect } from 'react';
import { useTour } from './TourProvider';

export const WelcomeModal: React.FC = () => {
    const { startTour, hasCompletedTour } = useTour();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const isFirstLogin = localStorage.getItem('is_first_login') === 'true';
        if (isFirstLogin && !hasCompletedTour) {
            setIsOpen(true);
        }
    }, [hasCompletedTour]);

    const handleStart = () => {
        setIsOpen(false);
        localStorage.removeItem('is_first_login');
        startTour();
    };

    const handleSkip = () => {
        setIsOpen(false);
        localStorage.removeItem('is_first_login');
        localStorage.setItem('tour_completed', 'skipped');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center">
                    <div className="text-5xl mb-4">🏗️</div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Welcome to Rukon CDE!
                    </h1>
                    <p className="text-blue-100">
                        Your Common Data Environment for construction projects
                    </p>
                </div>

                {/* Content */}
                <div className="px-8 py-6">
                    <p className="text-gray-600 text-center mb-6">
                        Let us show you around. This quick tour will help you discover
                        the key features and get started faster.
                    </p>

                    {/* Features preview */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                            { icon: '📁', label: 'Documents' },
                            { icon: '🏗️', label: '3D Viewer' },
                            { icon: '📊', label: 'Reports' },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="text-center p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="text-2xl mb-1">{item.icon}</div>
                                <div className="text-xs text-gray-600">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleStart}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Start Tour (2 min)
                        </button>
                        <button
                            onClick={handleSkip}
                            className="w-full py-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Skip for now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
