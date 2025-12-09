import { render, screen, fireEvent } from '@testing-library/react'
import { ReferenceLinker } from './ReferenceLinker'
import { describe, it, expect, vi } from 'vitest'

describe('ReferenceLinker', () => {
    it('renders the file list', () => {
        const onLink = vi.fn()
        render(<ReferenceLinker onLink={onLink} />)
        expect(screen.getByText('Struct_Grid_v3.ifc')).toBeInTheDocument()
        expect(screen.getByText('Link Reference')).toBeInTheDocument()
    })

    it('selects a file and calls onLink', () => {
        const onLink = vi.fn()
        render(<ReferenceLinker onLink={onLink} />)

        // Initial state: Button disabled
        const linkBtn = screen.getByText('Create Reference Link')
        expect(linkBtn).toBeDisabled()

        // Select file
        const fileRow = screen.getByText('Struct_Grid_v3.ifc')
        fireEvent.click(fileRow)

        // Button enabled
        expect(linkBtn).not.toBeDisabled()

        // Click Link
        fireEvent.click(linkBtn)
        expect(onLink).toHaveBeenCalledWith('f1')
    })
})
