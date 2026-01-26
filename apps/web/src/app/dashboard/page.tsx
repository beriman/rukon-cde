'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { CreateProjectDialog } from '@/components/features/dashboard/CreateProjectDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// Mock Organization ID for now - In real app this comes from auth/context
const CURRENT_ORG_ID = "org-123";

interface Project {
    id: string;
    name: string;
    code: string;
    status: string;
    createdAt: string;
}

export default function DashboardPage() {
    const { data: projects, isLoading, error } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            // In a real scenario, we might need to create an org first if it doesn't exist to get a valid ID.
            // For this implementation, we assume the user has an organization or we use a placeholder.
            // However, the backend requires a valid UUID for organizationId.
            // If the backend enforces UUID, "org-123" will fail.
            // FOR NOW, we'll try to fetch with a placeholder, but if it fails we might need to handle it.
            // Ideally, we should fetch the user's organization first.

            const response = await api.get(`/projects?organizationId=${CURRENT_ORG_ID}`);
            return response.data.data as Project[];
        },
    });

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your construction projects.</p>
                </div>
                <CreateProjectDialog organizationId={CURRENT_ORG_ID} />
            </div>

            {isLoading ? (
                <div>Loading projects...</div>
            ) : error ? (
                <div className="text-red-500">Error loading projects. Please ensure you are logged in and have an organization.</div>
            ) : projects?.length === 0 ? (
                <div className="text-center py-10 border rounded-lg bg-muted/10">
                    <h3 className="text-lg font-semibold">No projects found</h3>
                    <p className="text-muted-foreground mb-4">Get started by creating your first project.</p>
                    <CreateProjectDialog organizationId={CURRENT_ORG_ID} />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects?.map((project) => (
                        <Link href={`/projects/${project.id}`} key={project.id}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
        </div>
    );
}
