import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import { TimeController } from './TimeController';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Play: () => <span data-testid="play-icon">Play</span>,
    Pause: () => <span data-testid="pause-icon">Pause</span>,
    SkipBack: () => <span>SkipBack</span>,
    SkipForward: () => <span>SkipForward</span>,
}));

describe('TimeController', () => {
    const onTimeChange = vi.fn();
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    it('renders and displays dates', () => {
        render(<TimeController startDate={startDate} endDate={endDate} onTimeChange={onTimeChange} />);
        // Might be multiple 1/1/2024 (Start label and Current label)
        const dates = screen.getAllByText('1/1/2024');
        expect(dates.length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('1/31/2024')).toBeDefined();
    });

    it('updates time when slider changes', () => {
        render(<TimeController startDate={startDate} endDate={endDate} onTimeChange={onTimeChange} />);
        const slider = screen.getByRole('slider') as HTMLInputElement;
        const midTime = new Date('2024-01-15').getTime();

        fireEvent.change(slider, { target: { value: midTime } });
        expect(onTimeChange).toHaveBeenCalledWith(expect.any(Date));

        // Check if called with correct date. Note: onTimeChange called on mount too?
        // Last call should be new date.
        const lastCall = onTimeChange.mock.calls[onTimeChange.mock.calls.length - 1][0];
        expect(lastCall.getTime()).toBe(midTime);
    });

    it('toggles play/pause state', () => {
        render(<TimeController startDate={startDate} endDate={endDate} onTimeChange={onTimeChange} />);
        const playBtn = screen.getByText('Play Simulation');

        fireEvent.click(playBtn);
        // Should now show Pause
        expect(screen.getByText('Pause')).toBeDefined();

        fireEvent.click(screen.getByText('Pause'));
        // Should back to Play
        expect(screen.getByText('Play Simulation')).toBeDefined();
    });
});
