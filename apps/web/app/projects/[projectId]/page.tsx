'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Loader2, BarChart3, FileText, AlertTriangle, ShoppingCart, HardHat } from 'lucide-react';
import { UploadWizard } from '@/components/features/files/UploadWizard';
import { FileExplorer } from '@/components/features/files/FileExplorer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { DocumentMonitoring } from '@/components/features/projects/DocumentMonitoring';

interface Project {
    id: string;
    name: string;
    code: string;
}

interface DashboardData {
    id: string;
    name: string;
    metrics: {
        progress: number;
        safeManhours: number;
        incidentCount: number;
        orderedItems: number;
        openSubmittals: number;
        openIssues: number;
    }
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

    const { data: dashboard, isLoading: isDashboardLoading } = useQuery({
        queryKey: ['project-dashboard', projectId],
        queryFn: async () => {
            const response = await apiClient.get(`/projects/${projectId}/dashboard`);
            return response.data as DashboardData;
        },
        enabled: !!projectId,
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

    if (isProjectLoading || isDashboardLoading || isFoldersLoading) {
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
                <div className="flex gap-2">
                    <Link href={`/projects/${projectId}/requirements`}>
                        <Button variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            ISO Requirements
                        </Button>
                    </Link>
                    <UploadWizard
                        projectId={projectId}
                        projectCode={project.code}
                        folderId={wipFolder?.id}
                    />
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="planning" disabled>Planning (Coming Soon)</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Metrics Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Project Progress
                                </CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboard?.metrics.progress}%</div>
                                <Progress value={dashboard?.metrics.progress} className="h-2 mt-2" />
                            </CardContent>
                        </Card>

                        <Link href={`/projects/${projectId}/hse`}>
                            <Card className="hover:border-green-500 cursor-pointer transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        HSE Performance
                                    </CardTitle>
                                    <HardHat className="h-4 w-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{dashboard?.metrics.incidentCount}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Incidents Recorded
                                    </p>
                                    <div className="mt-2 text-xs text-green-700 font-medium">
                                        Click for details & reporting
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Procurement
                                </CardTitle>
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboard?.metrics.orderedItems}</div>
                                <p className="text-xs text-muted-foreground">
                                    Items ordered
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Open Issues
                                </CardTitle>
                                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboard?.metrics.openIssues}</div>
                                <p className="text-xs text-muted-foreground">
                                    BCF Topics active
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                                <CardDescription>
                                    Project summary and recent updates.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <div className="h-[200px] flex items-center justify-center text-muted-foreground border border-dashed rounded m-4">
                                    Activity Chart Placeholder
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Pending Submittals</CardTitle>
                                <CardDescription>
                                    Documents requiring approval ({dashboard?.metrics.openSubmittals})
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {dashboard && dashboard.metrics.openSubmittals > 0 ? (
                                        <div className="flex items-center">
                                            <div className="ml-auto font-medium text-amber-600">Action Required</div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground">No pending submittals.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6">
                        <DocumentMonitoring projectId={projectId} />
                    </div>
                </TabsContent>

                <TabsContent value="documents">
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
                </TabsContent>
            </Tabs>
        </div>
    );
}
