'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { PDFCompareViewer } from '@/components/features/viewer/PDFCompareViewer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { X, ArrowLeft } from 'lucide-react';

export default function ComparePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const projectId = params.projectId as string;
    const fileId = params.fileId as string;

    const versionA = searchParams.get('versionA'); // Old
    const versionB = searchParams.get('versionB'); // New

    return (
        <div className="h-screen w-screen bg-slate-100 relative flex flex-col">
            {/* Header Overlay */}
            <div className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Link href={`/projects/${projectId}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-sm font-bold text-slate-800">PDF Comparison</h1>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="text-red-500 font-medium">Version {versionA} (Old)</span>
                            <span>vs</span>
                            <span className="text-blue-500 font-medium">Version {versionB} (New)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Viewer Canvas */}
            <div className="flex-1 overflow-auto p-8 flex justify-center">
                {versionA && versionB ? (
                    <PDFCompareViewer
                        fileId={fileId}
                        versionA={parseInt(versionA)}
                        versionB={parseInt(versionB)}
                    />
                ) : (
                    <div className="text-center text-red-500">Missing version parameters</div>
                )}
            </div>
        </div>
    );
}
