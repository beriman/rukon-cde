/**
 * Floating Help Button
 * Quick access to Help Center and support
 */
import React, { useState } from 'react';
import { useTour } from '../onboarding/TourProvider';

interface HelpButtonProps {
    onOpenHelpCenter?: () => void;
    onOpenChat?: () => void;
}

export const HelpButton: React.FC<HelpButtonProps> = ({
    onOpenHelpCenter,
    onOpenChat
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { startTour } = useTour();

    const menuItems = [
        {
            icon: '📚',
            label: 'Help Center',
            description: 'Browse articles & guides',
            onClick: () => {
                onOpenHelpCenter?.();
                setIsOpen(false);
            },
        },
        {
            icon: '🎯',
            label: 'Product Tour',
            description: 'Take a guided tour',
            onClick: () => {
                startTour();
                setIsOpen(false);
            },
        },
        {
            icon: '📹',
            label: 'Video Tutorials',
            description: 'Watch how-to videos',
            onClick: () => {
                onOpenHelpCenter?.();
                setIsOpen(false);
            },
        },
        {
            icon: '💬',
            label: 'Contact Support',
            description: 'Get help from our team',
            onClick: () => {
                onOpenChat?.();
                setIsOpen(false);
            },
        },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {/* Menu */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-64 bg-white rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <h3 className="font-semibold">Need Help?</h3>
                        <p className="text-sm text-blue-100">We're here to assist you</p>
                    </div>
                    <div className="p-2">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={item.onClick}
                                className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
                            >
                                <span className="text-xl">{item.icon}</span>
                                <div>
                                    <div className="font-medium text-gray-900">{item.label}</div>
                                    <div className="text-xs text-gray-500">{item.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${isOpen
                        ? 'bg-gray-600 rotate-45'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                <span className="text-white text-2xl">{isOpen ? '✕' : '?'}</span>
            </button>
        </div>
    );
};

export default HelpButton;
