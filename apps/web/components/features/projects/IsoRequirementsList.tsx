'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';

interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
}

interface ProjectTask {
    id: string;
    title: string;
    description: string;
    checklist: ChecklistItem[];
    status: string;
}

export function IsoRequirementsList({ projectId }: { projectId: string }) {
    const [isSeeding, setIsSeeding] = useState(false);

    const { data: tasks, isLoading, refetch } = useQuery({
        queryKey: ['project-tasks', projectId],
        queryFn: async () => {
            const res = await apiClient.get<ProjectTask[]>(`/projects/${projectId}/tasks`);
            return res.data;
        }
    });

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            await apiClient.post(`/projects/${projectId}/iso-requirements`);
            toast.success('Requirements tasks generated');
            refetch();
        } catch (error) {
            toast.error('Failed to generate tasks');
        } finally {
            setIsSeeding(false);
        }
    };

    const toggleCheckitem = async (task: ProjectTask, itemId: string) => {
        const newChecklist = task.checklist.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );

        // Optimistic update could go here, but doing simple refetch for MVP safety
        try {
            await apiClient.patch(`/projects/tasks/${task.id}`, {
                checklist: newChecklist
            });
            refetch();
        } catch (error) {
            toast.error('Failed to update checklist');
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>;

    if (!tasks || tasks.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-slate-50 border-dashed">
                <h3 className="text-lg font-medium mb-2">No ISO 19650 Requirements Defined</h3>
                <p className="text-sm text-muted-foreground mb-6">
                    Start by generating the standard OIR, AIR, EIR, and BEP task lists.
                </p>
                <Button onClick={handleSeed} disabled={isSeeding}>
                    {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Setup ISO Requirements
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">ISO 19650 Requirements</h2>
                    <p className="text-muted-foreground">Manage your information requirement tasks.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()}>Refresh</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {tasks.map((task: ProjectTask) => (
                    <Card key={task.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg">{task.title}</CardTitle>
                            <CardDescription>{task.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <CheckSquare className="h-4 w-4" /> Checklist
                            </h4>
                            <div className="space-y-3">
                                {task.checklist && Array.isArray(task.checklist) ? task.checklist.map((item) => (
                                    <div key={item.id} className="flex items-start space-x-2">
                                        <Checkbox
                                            id={`${task.id}-${item.id}`}
                                            checked={item.completed}
                                            onCheckedChange={() => toggleCheckitem(task, item.id)}
                                        />
                                        <label
                                            htmlFor={`${task.id}-${item.id}`}
                                            className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                                        >
                                            {item.text}
                                        </label>
                                    </div>
                                )) : (
                                    <p className="text-xs text-muted-foreground">No items</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
