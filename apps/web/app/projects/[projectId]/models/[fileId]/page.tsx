'use client';

import { useParams } from 'next/navigation';
import { ModelViewer } from '@/components/features/viewer/ModelViewer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function ModelPage() {
    const params = useParams();
    const projectId = params.projectId as string;
    const fileId = params.fileId as string;

    return (
        <div className="h-screen w-screen bg-black relative flex flex-col">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <Link href={`/projects/${projectId}`}>
                        <Button variant="secondary" size="icon" className="rounded-full opacity-80 hover:opacity-100">
                            <X className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg text-white pointer-events-auto">
                    <h1 className="text-sm font-medium">3D Model Viewer</h1>
                    <p className="text-xs text-slate-300">File ID: {fileId}</p>
                </div>
            </div>

            {/* Viewer Canvas */}
            <div className="flex-1 overflow-hidden">
                <ModelViewer fileId={fileId} />
            </div>
        </div>
    );
}
