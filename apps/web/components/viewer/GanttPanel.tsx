import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Link2, Unlink } from 'lucide-react';
import { simulationService, SimulationLink } from '@/lib/api/simulation.service';
import { ScheduleTask } from '@/lib/api/schedule.service';


interface GanttPanelProps {
    projectId: string;
    modelId: string;
    selectedElementId: number | null; // expressID
    selectedElementGuid: string | null; // GUID
    isOpen: boolean;
    tasks: ScheduleTask[];
    onLinkCreated: () => void;
}

export function GanttPanel({ projectId, modelId, selectedElementId, selectedElementGuid, isOpen, tasks, onLinkCreated }: GanttPanelProps) {
    const [links, setLinks] = useState<SimulationLink[]>([]);
    const [selectedTask, setSelectedTask] = useState<string | null>(null);

    useEffect(() => {
        loadLinks();
    }, [projectId]);

    const loadLinks = async () => {
        try {
            const data = await simulationService.getLinks(projectId);
            setLinks(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLink = async () => {
        if (!selectedTask || !selectedElementGuid) return;
        try {
            await simulationService.createLink(projectId, {
                taskId: selectedTask,
                elementId: selectedElementGuid,
                modelId,
            });
            await loadLinks();
            onLinkCreated();
            setSelectedTask(null);
        } catch (err) {
            console.error('Failed to link', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-xl border-l flex flex-col z-20">
            <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold">4D Schedule</h2>
                <p className="text-xs text-gray-500">Link elements to schedule tasks</p>
            </div>

            <ScrollArea className="flex-1 p-4">
                {selectedElementId ? (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded text-sm">
                        <span className="font-medium">Selected Element:</span> {selectedElementId}
                        <br />
                        <span className="text-xs text-gray-500">{selectedElementGuid}</span>
                    </div>
                ) : (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-700">
                        Select a 3D element to link
                    </div>
                )}

                <div className="space-y-2">
                    {tasks.map(task => {
                        const isLinked = links.some(l => l.taskId === task.id && l.elementId === selectedElementGuid);
                        const taskLinkCount = links.filter(l => l.taskId === task.id).length;

                        return (
                            <div
                                key={task.id}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedTask === task.id ? 'ring-2 ring-primary border-primary' : 'hover:bg-gray-50'}`}
                                onClick={() => setSelectedTask(task.id)}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm">{task.title}</span>
                                    {taskLinkCount > 0 && <span className="text-xs bg-gray-100 px-1.5 rounded">{taskLinkCount} links</span>}
                                </div>
                                <div className="text-xs text-gray-500 flex justify-between">
                                    <span>{new Date(task.startDate).toLocaleDateString()}</span>
                                    <span>&rarr;</span>
                                    <span>{new Date(task.endDate).toLocaleDateString()}</span>
                                </div>

                                {selectedTask === task.id && selectedElementGuid && (
                                    <Button
                                        size="sm"
                                        className="w-full mt-2"
                                        onClick={handleLink}
                                        disabled={isLinked}
                                    >
                                        <Link2 className="w-3 h-3 mr-2" />
                                        {isLinked ? 'Already Linked' : 'Link Selection'}
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}
