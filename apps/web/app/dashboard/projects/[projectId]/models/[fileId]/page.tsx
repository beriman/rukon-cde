'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { bimService } from '@/lib/api/bim.service';
import { IfcViewer } from '@/components/viewer/IfcViewer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ModelViewerPage() {
    const params = useParams();
    const projectId = params.projectId as string;
    const fileId = params.fileId as string;

    const { data: accessToken, isLoading, error } = useQuery({
        queryKey: ['bim-token', projectId, fileId],
        queryFn: () => bimService.getAccessToken(projectId, fileId),
        enabled: !!projectId && !!fileId,
    });

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2 mx-auto"></div>
                    <p className="text-gray-500">Preparing secure viewer...</p>
                </div>
            </div>
        );
    }

    if (error || !accessToken) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4">
                <p className="text-red-500 font-medium">Failed to load model access token</p>
                <Link href={`/dashboard/projects/${projectId}`}>
                    <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Project
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] p-4 gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href={`/dashboard/projects/${projectId}`}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold">3D Viewer</h1>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">BETA</span>
                </div>
            </div>

            <IfcViewer modelUrl={accessToken.url} projectId={projectId} fileId={fileId} />
        </div>
    );
}
