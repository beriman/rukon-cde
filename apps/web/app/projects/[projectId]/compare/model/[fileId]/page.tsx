'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { ModelCompareViewer } from '@/components/features/viewer/ModelCompareViewer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { X, ArrowLeft } from 'lucide-react';

export default function CompareModelPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const projectId = params.projectId as string;
    const fileId = params.fileId as string;

    const versionA = searchParams.get('versionA');
    const versionB = searchParams.get('versionB');

    return (
        <div className="h-screen w-screen bg-black relative flex flex-col">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-4">
                    <Link href={`/projects/${projectId}`}>
                        <Button variant="secondary" size="icon" className="rounded-full opacity-80 hover:opacity-100">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg text-white pointer-events-auto">
                        <h1 className="text-sm font-medium">3D Model Diff</h1>
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                            <span className="text-red-400 font-medium">v{versionA}</span>
                            <span>vs</span>
                            <span className="text-green-400 font-medium">v{versionB}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {versionA && versionB ? (
                    <ModelCompareViewer
                        fileId={fileId}
                        versionA={parseInt(versionA)}
                        versionB={parseInt(versionB)}
                    />
                ) : (
                    <div className="text-white text-center p-20">Missing params</div>
                )}
            </div>
        </div>
    );
}
