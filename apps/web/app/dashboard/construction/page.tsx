'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ConstructionPage() {
    const { user } = useAuthStore();
    const router = useRouter();

    // Mock projects for now or fetch from API
    const projects = [
        { id: 'proj-1', name: 'Project Alpha' },
        { id: 'proj-2', name: 'Apartment Complex B' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Construction Monitoring</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Card key={project.id}>
                        <CardHeader>
                            <CardTitle>{project.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => router.push(`/dashboard/construction/${project.id}`)}
                                className="w-full"
                            >
                                View Progress
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
