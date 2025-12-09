'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, AlertTriangle } from 'lucide-react';

interface Incident {
    id: string;
    type: string;
    severity: string;
    date: string;
    location: string;
    description: string;
    status: string;
    reporter: { name: string; email: string };
}

export default function IncidentsPage() {
    const router = useRouter();
    const [projectId, setProjectId] = useState<string>('');
    const [projects, setProjects] = useState<any[]>([]);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await apiClient.get('/projects', { params: { status: 'ACTIVE' } });
            setProjects(res.data || []);
            if (res.data && res.data.length > 0) {
                setProjectId(res.data[0].id);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        if (!projectId) return;
        const fetchIncidents = async () => {
            setLoading(true);
            try {
                const res = await apiClient.get(`/projects/${projectId}/incidents`);
                setIncidents(res.data || []);
            } catch (error) {
                console.error('Failed to fetch incidents', error);
            } finally {
                setLoading(false);
            }
        };
        fetchIncidents();
    }, [projectId]);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'CRITICAL': return 'bg-red-600 text-white';
            case 'HIGH': return 'bg-orange-600 text-white';
            case 'MEDIUM': return 'bg-yellow-600 text-white';
            case 'LOW': return 'bg-green-600 text-white';
            default: return 'bg-gray-600 text-white';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'INVESTIGATING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'CLOSED': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading && projects.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Incident Management</h2>
                    <p className="text-sm text-muted-foreground">Report and track safety incidents</p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                    >
                        {projects.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <Button onClick={() => router.push(`/dashboard/hse/incidents/create?projectId=${projectId}`)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Report Incident
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : incidents.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No incidents reported</h3>
                        <p className="text-sm text-muted-foreground">Click "Report Incident" to submit a new report</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {incidents.map((incident) => (
                        <Card key={incident.id} className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => router.push(`/dashboard/hse/incidents/${incident.id}`)}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">{incident.type.replace(/_/g, ' ')}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(incident.date).toLocaleDateString()} • {incident.location}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge className={getSeverityColor(incident.severity)}>
                                            {incident.severity}
                                        </Badge>
                                        <Badge variant="outline" className={getStatusColor(incident.status)}>
                                            {incident.status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm line-clamp-2">{incident.description}</p>
                                <p className="text-xs text-muted-foreground mt-2">Reported by {incident.reporter.name}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
