import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SmartReviewPanel } from './SmartReviewPanel';
import { smartReviewService } from '@/lib/api/smart-review.service';
import { vi } from 'vitest';

// Mock dependencies
vi.mock('@/lib/api/smart-review.service', () => ({
    smartReviewService: {
        getRules: vi.fn(),
        createReport: vi.fn(),
    }
}));
const mockIfcModel = {
    modelID: 1,
    ifcManager: {
        getAllItems: vi.fn(),
    }
};

describe('SmartReviewPanel', () => {
    const defaultProps = {
        projectId: 'p1',
        fileId: 'f1',
        ifcModel: mockIfcModel as any,
        onFocus: vi.fn(),
        isOpen: true,
        onClose: vi.fn(),
    };

    beforeEach(() => {
        (smartReviewService.getRules as any).mockResolvedValue([
            { id: 'r1', name: 'Test Rule', isActive: true }
        ]);
    });

    it('renders correctly when open', async () => {
        render(<SmartReviewPanel {...defaultProps} />);
        expect(screen.getByText('Smart Review')).toBeInTheDocument();
        await waitFor(() => expect(screen.getByText('Test Rule')).toBeInTheDocument());
    });

    it('does not render when closed', () => {
        render(<SmartReviewPanel {...defaultProps} isOpen={false} />);
        expect(screen.queryByText('Smart Review')).not.toBeInTheDocument();
    });

    it('runs validation on button click', async () => {
        render(<SmartReviewPanel {...defaultProps} />);
        await waitFor(() => expect(screen.getByText('Test Rule')).toBeInTheDocument());

        const button = screen.getByText('Run Validation');
        fireEvent.click(button);

        expect(screen.getByText('Checking...')).toBeInTheDocument();
        // Simulating completion
        await waitFor(() => expect(screen.getByText('Run Validation')).toBeInTheDocument());
    });
});
