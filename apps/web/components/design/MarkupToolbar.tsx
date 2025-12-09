'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { MousePointer2, Square, Circle, Type, Eraser, Cloud } from 'lucide-react';

interface MarkupToolbarProps {
    activeTool: string;
    setTool: (tool: string) => void;
    onSave: () => void;
}

export function MarkupToolbar({ activeTool, setTool, onSave }: MarkupToolbarProps) {
    const tools = [
        { id: 'select', icon: <MousePointer2 className="h-4 w-4" />, label: 'Select' },
        { id: 'rect', icon: <Square className="h-4 w-4" />, label: 'Box' },
        { id: 'circle', icon: <Circle className="h-4 w-4" />, label: 'Circle' },
        { id: 'cloud', icon: <Cloud className="h-4 w-4" />, label: 'Cloud' },
        { id: 'text', icon: <Type className="h-4 w-4" />, label: 'Text' },
    ];

    return (
        <div className="flex items-center gap-2 p-2 bg-white border rounded shadow-md z-10">
            {tools.map(tool => (
                <Button
                    key={tool.id}
                    variant={activeTool === tool.id ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setTool(tool.id)}
                    title={tool.label}
                >
                    {tool.icon}
                </Button>
            ))}
            <div className="w-px h-6 bg-gray-200 mx-2" />
            <Button variant="ghost" size="icon" onClick={() => setTool('eraser')} title="Clear">
                <Eraser className="h-4 w-4 text-red-500" />
            </Button>
            <Button size="sm" className="ml-2" onClick={onSave}>
                Save Markups
            </Button>
        </div>
    );
}
