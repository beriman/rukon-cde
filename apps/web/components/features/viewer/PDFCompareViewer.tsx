'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { apiClient } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFCompareViewerProps {
    fileId: string;
    versionA: number; // Old
    versionB: number; // New
}

export function PDFCompareViewer({ fileId, versionA, versionB }: PDFCompareViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState(1.0);
    const [mode, setMode] = useState<'overlay' | 'side-by-side'>('overlay');

    // Fetch URLs using version param
    const { data: urlA } = useQuery({
        queryKey: ['download', fileId, versionA],
        queryFn: async () => (await apiClient.get(`/files/${fileId}/download?version=${versionA}`)).data.url,
    });

    const { data: urlB } = useQuery({
        queryKey: ['download', fileId, versionB],
        queryFn: async () => (await apiClient.get(`/files/${fileId}/download?version=${versionB}`)).data.url,
    });

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    if (!urlA || !urlB) {
        return <div className="flex h-[400px] items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>
    }

    return (
        <div className="w-full max-w-6xl flex flex-col items-center gap-6">

            {/* Controls */}
            <div className="sticky top-4 bg-white/90 backdrop-blur border rounded-full px-6 py-2 shadow-lg flex items-center gap-6 z-20">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}><ZoomOut className="h-4 w-4" /></Button>
                    <span className="text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
                    <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(2.0, s + 0.1))}><ZoomIn className="h-4 w-4" /></Button>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                    <button
                        onClick={() => setMode('overlay')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mode === 'overlay' ? 'bg-white shadow' : 'text-slate-500'}`}
                    >
                        Overlay (Diff)
                    </button>
                    <button
                        onClick={() => setMode('side-by-side')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mode === 'side-by-side' ? 'bg-white shadow' : 'text-slate-500'}`}
                    >
                        Side by Side
                    </button>
                </div>
            </div>

            {mode === 'overlay' ? (
                <div className="relative shadow-2xl bg-white border min-h-[800px] overflow-hidden">
                    {/* Layer A (Old) - Red Tint */}
                    <div style={{ position: 'relative', filter: 'sepia(1) saturate(1000%) hue-rotate(-50deg) opacity(0.5)' }}>
                        <Document file={urlA} onLoadSuccess={onDocumentLoadSuccess}>
                            <Page pageNumber={1} scale={scale} renderTextLayer={false} />
                        </Document>
                    </div>

                    {/* Layer B (New) - Blue Tint */}
                    <div style={{ position: 'absolute', top: 0, left: 0, filter: 'sepia(1) saturate(1000%) hue-rotate(180deg) opacity(0.5)', mixBlendMode: 'multiply' }}>
                        <Document file={urlB}>
                            <Page pageNumber={1} scale={scale} renderTextLayer={false} />
                        </Document>
                    </div>
                </div>
            ) : (
                <div className="flex gap-4">
                    <div className="border border-red-200 bg-red-50/10 p-4 rounded-lg">
                        <div className="text-center mb-2 font-medium text-red-500">Old Version (v{versionA})</div>
                        <Document file={urlA}>
                            <Page pageNumber={1} scale={scale} renderTextLayer={false} />
                        </Document>
                    </div>
                    <div className="border border-blue-200 bg-blue-50/10 p-4 rounded-lg">
                        <div className="text-center mb-2 font-medium text-blue-500">New Version (v{versionB})</div>
                        <Document file={urlB}>
                            <Page pageNumber={1} scale={scale} renderTextLayer={false} />
                        </Document>
                    </div>
                </div>
            )}

            <div className="text-slate-400 text-xs mt-4">
                Showing Page 1 of {numPages}
            </div>
        </div>
    );
}
