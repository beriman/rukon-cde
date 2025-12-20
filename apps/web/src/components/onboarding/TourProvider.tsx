/**
 * Product Tour Service
 * Manages tour state and progression
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TourStep {
    id: string;
    target: string; // CSS selector
    title: string;
    content: string;
    placement: 'top' | 'bottom' | 'left' | 'right';
    action?: string; // Optional action description
}

interface TourContextType {
    isActive: boolean;
    currentStep: number;
    steps: TourStep[];
    startTour: () => void;
    endTour: () => void;
    nextStep: () => void;
    prevStep: () => void;
    skipTour: () => void;
    hasCompletedTour: boolean;
}

const TOUR_STEPS: TourStep[] = [
    {
        id: 'welcome',
        target: '[data-testid="dashboard"]',
        title: '👋 Welcome to Rukon CDE!',
        content: 'This is your project dashboard. Let\'s take a quick tour of the key features.',
        placement: 'bottom',
    },
    {
        id: 'file-upload',
        target: '[data-testid="nav-documents"]',
        title: '📁 Document Management',
        content: 'Upload, organize, and manage all your project documents here. We support IFC, PDF, DWG, and more.',
        placement: 'right',
        action: 'Click to upload your first file',
    },
    {
        id: 'cde-workflow',
        target: '[data-testid="nav-workflows"]',
        title: '🔄 CDE Workflows',
        content: 'Set up approval workflows, manage revisions, and track document status with ISO 19650 compliance.',
        placement: 'right',
    },
    {
        id: '3d-viewer',
        target: '[data-testid="nav-viewer"]',
        title: '🏗️ 3D Model Viewer',
        content: 'View IFC models in our web-based 3D viewer. Create BCF issues, measure distances, and more.',
        placement: 'right',
    },
    {
        id: 'reports',
        target: '[data-testid="nav-reports"]',
        title: '📊 Automated Reports',
        content: 'Generate weekly or monthly reports with one click. Includes S-Curve, HSE stats, and photos.',
        placement: 'right',
    },
    {
        id: 'hse',
        target: '[data-testid="nav-hse"]',
        title: '🦺 Health & Safety',
        content: 'Log incidents, track safe work days, and maintain your HSE dashboard.',
        placement: 'right',
    },
    {
        id: 'ai-assistant',
        target: '[data-testid="nav-ai"]',
        title: '🤖 AI Assistant',
        content: 'Ask questions about your project documents. Our AI will find answers and cite sources.',
        placement: 'right',
    },
    {
        id: 'complete',
        target: '[data-testid="user-menu"]',
        title: '✅ You\'re All Set!',
        content: 'Access your profile, settings, and help from here. Happy building!',
        placement: 'bottom',
    },
];

const TourContext = createContext<TourContextType | null>(null);

export function TourProvider({ children }: { children: ReactNode }) {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [hasCompletedTour, setHasCompletedTour] = useState(false);

    useEffect(() => {
        // Check if user has completed tour
        const completed = localStorage.getItem('tour_completed');
        const isFirstLogin = localStorage.getItem('is_first_login') === 'true';

        setHasCompletedTour(completed === 'true');

        // Auto-start tour on first login
        if (isFirstLogin && !completed) {
            setTimeout(() => setIsActive(true), 1000);
            localStorage.removeItem('is_first_login');
        }
    }, []);

    const startTour = () => {
        setCurrentStep(0);
        setIsActive(true);
    };

    const endTour = () => {
        setIsActive(false);
        setHasCompletedTour(true);
        localStorage.setItem('tour_completed', 'true');
    };

    const skipTour = () => {
        setIsActive(false);
        localStorage.setItem('tour_completed', 'skipped');
    };

    const nextStep = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            endTour();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <TourContext.Provider
            value={{
                isActive,
                currentStep,
                steps: TOUR_STEPS,
                startTour,
                endTour,
                nextStep,
                prevStep,
                skipTour,
                hasCompletedTour,
            }}
        >
            {children}
        </TourContext.Provider>
    );
}

export function useTour() {
    const context = useContext(TourContext);
    if (!context) {
        throw new Error('useTour must be used within TourProvider');
    }
    return context;
}

export { TOUR_STEPS };
export type { TourStep };
