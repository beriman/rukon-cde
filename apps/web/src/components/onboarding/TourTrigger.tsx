/**
 * Tour Trigger Button
 * Allows users to restart the product tour
 */
import React from 'react';
import { useTour } from './TourProvider';

export const TourTrigger: React.FC = () => {
    const { startTour, isActive, hasCompletedTour } = useTour();

    if (isActive) return null;

    return (
        <button
            onClick={startTour}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
            data-testid="tour-trigger"
        >
            <span className="text-lg">🎯</span>
            <span className="text-sm font-medium">
                {hasCompletedTour ? 'Restart Tour' : 'Take Tour'}
            </span>
        </button>
    );
};

export default TourTrigger;
