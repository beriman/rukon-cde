'use client';

import { PDFMarkupViewer } from '@/components/design/PDFMarkupViewer';

export default function ReviewPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Design Review (Markup)</h1>
            {/* Demo file URL */}
            <PDFMarkupViewer fileUrl="/uploads/demo-drawing.pdf" />
        </div>
    );
}
