import { render, screen, fireEvent } from '@testing-library/react'
import { EIRWizard } from './EIRWizard'
import { describe, it, expect, vi } from 'vitest'

// Mock UI components implies shallow rendering or integration. 
// Since we have the real UI components installed, we can render them (Integration).
// But Radix UI usually requires some polyfills (ResizeObserver).

describe('EIRWizard', () => {
    it('renders the first step correctly', () => {
        render(<EIRWizard />)
        expect(screen.getByText('EIR Generator - Step 1')).toBeInTheDocument()
        expect(screen.getByText('Information Standards')).toBeInTheDocument()
        expect(screen.getByText('Naming Convention Standard')).toBeInTheDocument()
    })

    it('navigates to step 2 on Next click', () => {
        render(<EIRWizard />)
        const nextButton = screen.getByText('Next')
        fireEvent.click(nextButton)
        expect(screen.getByText('EIR Generator - Step 2')).toBeInTheDocument()
        expect(screen.getByText('Methods & Procedures')).toBeInTheDocument()
    })

    it('navigates to step 3 and shows checkboxes', () => {
        render(<EIRWizard />)
        const nextButton = screen.getByText('Next')
        fireEvent.click(nextButton) // To Step 2
        fireEvent.click(nextButton) // To Step 3

        expect(screen.getByText('EIR Generator - Step 3')).toBeInTheDocument()
        expect(screen.getByLabelText('Include Organizational Information Requirements (OIR)')).toBeInTheDocument()
    })
})
