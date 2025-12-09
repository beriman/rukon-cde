'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Workspace {
    id: string;
    name: string;
    discipline: string;
    projectId: string;
}

export function WorkspaceDashboard({ projectId }: { projectId: string }) {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Determine API URL based on environment or default to localhost
        // For client components, using relative path or full URL if needed
        // Assuming backend is proxying or CORS allowed
        const fetchWorkspaces = async () => {
            try {
                // In a real app we would use an API client or fetch from absolute URL if on different port
                // For development default: 
                const res = await fetch(`http://localhost:3001/design/workspaces/${projectId}`);
                if (res.ok) {
                    const data = await res.json();
                    setWorkspaces(data);
                } else {
                    // Fallback for demo if API not running
                    setWorkspaces([
                        { id: 'w1', name: 'WIP_ARCH', discipline: 'ARCH', projectId },
                        { id: 'w2', name: 'WIP_STRUCT', discipline: 'STRUCT', projectId },
                        { id: 'w3', name: 'WIP_MEP', discipline: 'MEP', projectId },
                    ]);
                }
            } catch (e) {
                console.error('Failed to fetch workspaces', e);
                // Fallback
                setWorkspaces([
                    { id: 'mock1', name: 'WIP_ARCH (Offline)', discipline: 'ARCH', projectId },
                    { id: 'mock2', name: 'WIP_STRUCT', discipline: 'STRUCT', projectId },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkspaces();
    }, [projectId]);

    if (loading) return <div>Loading workspaces...</div>;

    const getDisciplineColor = (disc: string) => {
        switch (disc) {
            case 'ARCH': return 'bg-blue-100 text-blue-800';
            case 'STRUCT': return 'bg-orange-100 text-orange-800';
            case 'MEP': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workspaces.map((ws) => (
                <Card key={ws.id} className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-blue-500">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{ws.name}</CardTitle>
                            <Badge variant="outline" className={getDisciplineColor(ws.discipline)}>
                                {ws.discipline}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500 mb-4">
                            Restricted Use Area. Only {ws.discipline} team members can edit files here.
                        </p>
                        <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-400">0 Files</div>
                            <Button variant="outline" size="sm">Enter Folder</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
