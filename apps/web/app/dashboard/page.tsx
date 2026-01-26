'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { CreateProjectDialog } from '@/components/features/dashboard/CreateProjectDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Maximize2, Plus } from 'lucide-react';
import { useOrganization } from '@/components/providers/OrganizationProvider';
import { Skeleton } from '@/components/ui/skeleton';

interface Project {
    id: string;
    name: string;
    code: string;
    status: string;
    createdAt: string;
}

export default function DashboardPage() {
    const { currentOrg, isLoading: isOrgLoading } = useOrganization();

    const { data: projects, isLoading: isProjectsLoading, error } = useQuery({
        queryKey: ['projects', currentOrg?.id],
        queryFn: async () => {
            if (!currentOrg?.id) return [];
            const response = await apiClient.get(`/projects?organizationId=${currentOrg.id}`);
            return response.data.data as Project[];
        },
        enabled: !!currentOrg?.id,
    });

    if (isOrgLoading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-1/3 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-slate-100 rounded animate-pulse" />
            </div>
        );
    }

    // If no orgs, maybe show a "Create Organization" prompt? (Out of scope for this specific task but good for UX)
    if (!currentOrg) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-lg border border-dashed">
                <h3 className="text-xl font-semibold mb-2">Welcome to Rukon</h3>
                <p className="text-muted-foreground mb-6">Please create or join an organization to get started.</p>
                {/* Add Create Org Button here later */}
            </div>
        );
    }

    return (
        <>
            {/* Header Area */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-slate-800 tracking-tight mb-1">
                        My Dashboard
                    </h1>
                    <p className="text-sm text-slate-500 font-light">
                        Overview of your projects and assigned tasks in <strong>{currentOrg.name}</strong>
                    </p>
                </div>
                <div className="flex gap-2">
                    <CreateProjectDialog organizationId={currentOrg.id} />
                </div>
            </div>

            {isProjectsLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 rounded-lg border bg-slate-50 animate-pulse"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="p-4 text-red-500 border border-red-200 bg-red-50 rounded-lg">
                    Error loading projects. Please check your connection.
                </div>
            ) : projects?.length === 0 ? (
                <div className="text-center py-10 border rounded-lg bg-muted/10 border-dashed">
                    <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                    <p className="text-muted-foreground mb-4">Get started by creating your first project.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects?.map((project) => (
                        <Link href={`/projects/${project.id}`} key={project.id}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle>{project.name}</CardTitle>
                                    <CardDescription>Code: {project.code}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <span className={`px-2 py-1 rounded text-xs ${project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {project.status}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(project.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
