import { useState, useMemo } from 'react';

export function useSimulation(scheduleTasks: any[], links: any[]) {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [isPlaying, setIsPlaying] = useState(false);

    // Calculate Min/Max dates
    const { startDate, endDate } = useMemo(() => {
        if (scheduleTasks.length === 0) return { startDate: new Date(), endDate: new Date() };

        const dates = scheduleTasks.flatMap(t => [new Date(t.startDate), new Date(t.endDate)]);
        return {
            startDate: new Date(Math.min(...dates.map(d => d.getTime()))),
            endDate: new Date(Math.max(...dates.map(d => d.getTime())))
        };
    }, [scheduleTasks]);

    // Compute Element States
    // This is the heavy logic part - optimize later if needed
    const elementStates = useMemo(() => {
        const states = new Map<string, 'HIDDEN' | 'IN_PROGRESS' | 'COMPLETED'>();

        // Default to HIDDEN or ghosted if configured

        links.forEach(link => {
            const task = scheduleTasks.find(t => t.id === link.scheduleTaskId);
            if (!task) return;

            const start = new Date(task.startDate);
            const end = new Date(task.endDate);

            if (currentDate < start) {
                states.set(link.elementId, 'HIDDEN');
            } else if (currentDate >= start && currentDate <= end) {
                states.set(link.elementId, 'IN_PROGRESS');
            } else {
                states.set(link.elementId, 'COMPLETED');
            }
        });

        return states;
    }, [currentDate, scheduleTasks, links]);

    return {
        currentDate,
        setCurrentDate,
        isPlaying,
        setIsPlaying,
        startDate,
        endDate,
        elementStates,
    };
}
