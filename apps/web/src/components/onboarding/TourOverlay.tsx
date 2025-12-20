/**
 * Tour Overlay Component
 * Renders the spotlight and tooltip for current tour step
 */
import React, { useEffect, useState, useRef } from 'react';
import { useTour, TourStep } from './TourProvider';

interface TooltipPosition {
    top: number;
    left: number;
    arrowPosition: 'top' | 'bottom' | 'left' | 'right';
}

export const TourOverlay: React.FC = () => {
    const { isActive, currentStep, steps, nextStep, prevStep, skipTour, endTour } = useTour();
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const step = steps[currentStep];

    useEffect(() => {
        if (!isActive || !step) return;

        const targetElement = document.querySelector(step.target);
        if (!targetElement) return;

        const rect = targetElement.getBoundingClientRect();
        setTargetRect(rect);

        // Calculate tooltip position
        const tooltipWidth = 320;
        const tooltipHeight = 180;
        const padding = 16;

        let top = 0;
        let left = 0;
        let arrowPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

        switch (step.placement) {
            case 'bottom':
                top = rect.bottom + padding;
                left = rect.left + rect.width / 2 - tooltipWidth / 2;
                arrowPosition = 'top';
                break;
            case 'top':
                top = rect.top - tooltipHeight - padding;
                left = rect.left + rect.width / 2 - tooltipWidth / 2;
                arrowPosition = 'bottom';
                break;
            case 'right':
                top = rect.top + rect.height / 2 - tooltipHeight / 2;
                left = rect.right + padding;
                arrowPosition = 'left';
                break;
            case 'left':
                top = rect.top + rect.height / 2 - tooltipHeight / 2;
                left = rect.left - tooltipWidth - padding;
                arrowPosition = 'right';
                break;
        }

        // Keep tooltip on screen
        left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
        top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));

        setTooltipPosition({ top, left, arrowPosition });

        // Scroll target into view
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [isActive, currentStep, step]);

    if (!isActive || !step || !targetRect) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-[9998]" onClick={skipTour}>
                <svg className="w-full h-full">
                    <defs>
                        <mask id="spotlight-mask">
                            <rect width="100%" height="100%" fill="white" />
                            <rect
                                x={targetRect.left - 8}
                                y={targetRect.top - 8}
                                width={targetRect.width + 16}
                                height={targetRect.height + 16}
                                rx="8"
                                fill="black"
                            />
                        </mask>
                    </defs>
                    <rect
                        width="100%"
                        height="100%"
                        fill="rgba(0, 0, 0, 0.7)"
                        mask="url(#spotlight-mask)"
                    />
                </svg>
            </div>

            {/* Spotlight ring */}
            <div
                className="fixed z-[9999] rounded-lg ring-4 ring-blue-500 ring-opacity-75 animate-pulse pointer-events-none"
                style={{
                    top: targetRect.top - 8,
                    left: targetRect.left - 8,
                    width: targetRect.width + 16,
                    height: targetRect.height + 16,
                }}
            />

            {/* Tooltip */}
            {tooltipPosition && (
                <div
                    ref={tooltipRef}
                    className="fixed z-[10000] w-80 bg-white rounded-xl shadow-2xl p-4"
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Arrow */}
                    <div
                        className={`absolute w-4 h-4 bg-white transform rotate-45 ${tooltipPosition.arrowPosition === 'top' ? '-top-2 left-1/2 -ml-2' :
                                tooltipPosition.arrowPosition === 'bottom' ? '-bottom-2 left-1/2 -ml-2' :
                                    tooltipPosition.arrowPosition === 'left' ? 'top-1/2 -left-2 -mt-2' :
                                        'top-1/2 -right-2 -mt-2'
                            }`}
                    />

                    {/* Content */}
                    <div className="relative">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{step.content}</p>

                        {step.action && (
                            <p className="text-blue-600 text-sm font-medium mb-4">
                                💡 {step.action}
                            </p>
                        )}

                        {/* Progress */}
                        <div className="flex items-center gap-1 mb-4">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 flex-1 rounded-full ${i <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={skipTour}
                                className="text-gray-400 text-sm hover:text-gray-600"
                            >
                                Skip tour
                            </button>

                            <div className="flex gap-2">
                                {currentStep > 0 && (
                                    <button
                                        onClick={prevStep}
                                        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={nextStep}
                                    className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TourOverlay;
