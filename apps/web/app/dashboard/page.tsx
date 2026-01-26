'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { CreateProjectDialog } from '@/components/features/dashboard/CreateProjectDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Maximize2, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useOrganization } from '@/components/providers/OrganizationProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface Project {
    id: string;
    name: string;
    code: string;
    status: string;
    createdAt: string;
}

interface DashboardTask {
    id: string;
    title: string;
    status: string;
    dueDate: string | null;
    type: 'DELIVERABLE' | 'INCIDENT_ACTION' | 'BCF_TOPIC';
    priority?: string;
}

interface ProjectWithTasks {
    id: string;
    name: string;
    code: string;
    organizationName: string;
    taskCount: number;
    tasks: DashboardTask[];
}

export default function DashboardPage() {
    const { currentOrg, isLoading: isOrgLoading } = useOrganization();

    // Fetch Projects List
    const { data: projects, isLoading: isProjectsLoading } = useQuery({
        queryKey: ['projects', currentOrg?.id],
        queryFn: async () => {
            if (!currentOrg?.id) return [];
            const response = await apiClient.get(`/projects?organizationId=${currentOrg.id}`);
            return response.data.data as Project[];
        },
        enabled: !!currentOrg?.id,
    });

    // Fetch User Tasks (My Dashboard)
    const { data: myDashboard, isLoading: isDashboardLoading } = useQuery({
        queryKey: ['user-dashboard'],
        queryFn: async () => {
            const response = await apiClient.get('/users/me/dashboard');
            return response.data as ProjectWithTasks[];
        },
    });

    // Flatten tasks for "My Tasks" view
    const allTasks = myDashboard?.flatMap(p =>
        p.tasks.map(t => ({ ...t, projectName: p.name, projectId: p.id }))
    ) || [];

    if (isOrgLoading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-1/3 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-slate-100 rounded animate-pulse" />
            </div>
        );
    }

    if (!currentOrg) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-lg border border-dashed">
                <h3 className="text-xl font-semibold mb-2">Welcome to Rukon</h3>
                <p className="text-muted-foreground mb-6">Please create or join an organization to get started.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex justify-between items-start">
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

            {/* My Tasks Section */}
            <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    My Pending Tasks
                </h2>
                {isDashboardLoading ? (
                    <div className="space-y-2">
                        {[1, 2].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                ) : allTasks.length === 0 ? (
                    <div className="p-8 text-center border rounded-lg bg-slate-50 text-slate-500">
                        You have no pending tasks across your projects.
                    </div>
                ) : (
                    <div className="border rounded-lg divide-y bg-white">
                        {allTasks.map(task => (
                            <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${task.type === 'DELIVERABLE' ? 'bg-blue-100 text-blue-600' :
                                            task.type === 'INCIDENT_ACTION' ? 'bg-red-100 text-red-600' :
                                                'bg-orange-100 text-orange-600'
                                        }`}>
                                        {task.type === 'DELIVERABLE' && <Clock className="h-4 w-4" />}
                                        {task.type === 'INCIDENT_ACTION' && <AlertCircle className="h-4 w-4" />}
                                        {task.type === 'BCF_TOPIC' && <Maximize2 className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm">{task.title}</h4>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                            <span>{task.projectName}</span>
                                            {task.dueDate && (
                                                <>
                                                    <span>•</span>
                                                    <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant="outline" className="capitalize">{task.status.replace('_', ' ').toLowerCase()}</Badge>
                                    <Link href={`/projects/${task.projectId}/planning`}>
                                        <Button size="sm" variant="ghost">View</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Projects Section */}
            <section>
                <h2 className="text-xl font-semibold mb-4">My Projects</h2>
                {isProjectsLoading ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 rounded-lg border bg-slate-50 animate-pulse"></div>
                        ))}
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
                                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-l-4 border-l-transparent hover:border-l-blue-600">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">{project.name}</CardTitle>
                                        <CardDescription>Code: {project.code}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center mt-4">
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
            </section>
        </div>
    );
}
