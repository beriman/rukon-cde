'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { UploadWizard } from '@/components/features/files/UploadWizard';
import { FileExplorer } from '@/components/features/files/FileExplorer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Project {
    id: string;
    name: string;
    code: string;
}

export default function ProjectDetailsPage() {
    const params = useParams();
    const projectId = params.projectId as string;

    const { data: project, isLoading: isProjectLoading } = useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => {
            const response = await apiClient.get(`/projects/${projectId}`);
            return response.data as Project;
        },
    });

    // Fetch Folders to get WIP Folder ID
    const { data: folders, isLoading: isFoldersLoading } = useQuery({
        queryKey: ['folders', projectId],
        queryFn: async () => {
            const response = await apiClient.get(`/projects/${projectId}/folders`);
            return response.data;
        },
        enabled: !!projectId,
    });

    // Find WIP Folder
    const wipFolder = folders?.find((f: any) => f.name === 'WIP');

    if (isProjectLoading || isFoldersLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
                        <p className="text-sm text-slate-500">{project.code}</p>
                    </div>
                </div>
                <UploadWizard
                    projectId={projectId}
                    projectCode={project.code}
                    folderId={wipFolder?.id}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                {/* Sidebar / Folder Tree Placeholder */}
                <div className="col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Folders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {folders?.map((folder: any) => (
                                    <div key={folder.id} className={`text-sm p-2 rounded cursor-pointer ${folder.name === 'WIP' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-100'}`}>
                                        📁 {folder.name}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content / File Explorer */}
                <div className="col-span-3">
                    {wipFolder ? (
                        <FileExplorer folderId={wipFolder.id} />
                    ) : (
                        <div className="rounded-lg border border-dashed p-8 text-center text-slate-500">
                            WIP Folder not found. Please check project setup.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
