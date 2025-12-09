import { render, screen, fireEvent, act } from '@testing-library/react'
import { FederationViewer } from './FederationViewer'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('FederationViewer', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('renders loaded models list', () => {
        render(<FederationViewer />)
        expect(screen.getByText('Architecture_v5.ifc')).toBeInTheDocument()
        expect(screen.getByText('Structural_{Frame}_v2.ifc')).toBeInTheDocument()
    })

    it('runs clash check simulation', async () => {
        render(<FederationViewer />)

        const checkBtn = screen.getByText('Run Clash Check')
        fireEvent.click(checkBtn)

        // Fast-forward time
        act(() => {
            vi.advanceTimersByTime(1000)
        })

        // Check for result immediately after time skip
        const alert = screen.getByText(/Found.*clashes/i)
        expect(alert).toBeInTheDocument()
        expect(checkBtn).toHaveTextContent('Check Complete')
    })
})
