import { render, screen, fireEvent } from '@testing-library/react'
import { DesignViewer } from './DesignViewer'
import { describe, it, expect } from 'vitest'

describe('DesignViewer', () => {
    it('renders the toolbar', () => {
        render(<DesignViewer />)
        expect(screen.getByTitle('Select')).toBeInTheDocument()
        expect(screen.getByTitle('Box')).toBeInTheDocument()
        expect(screen.getByText(/Mode:\s*SELECT/i)).toBeInTheDocument()
    })

    it('changes tool mode when button clicked', () => {
        render(<DesignViewer />)
        const boxBtn = screen.getByTitle('Box')
        fireEvent.click(boxBtn)
        expect(screen.getByText(/Mode:\s*RECT/i)).toBeInTheDocument()
    })

    // Note: Testing canvas click requires mocking getBoundingClientRect which is tricky in jsdom without setup.
    // We verify the logical state change of tool selection for now.
})
