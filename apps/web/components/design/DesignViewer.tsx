'use client';

import React, { useState, useRef } from 'react';
import { MarkupToolbar } from './MarkupToolbar';

interface Markup {
    id: string;
    type: string;
    x: number;
    y: number;
    w?: number;
    h?: number;
    text?: string;
}

export function DesignViewer({ fileUrl }: { fileUrl?: string }) {
    const [tool, setTool] = useState('select');
    const [markups, setMarkups] = useState<Markup[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (tool === 'select') return;

        // Simple mock implementation: Click to place a shape
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newMarkup: Markup = {
            id: crypto.randomUUID(),
            type: tool,
            x,
            y,
            w: 100, // Default size
            h: 100,
        };

        setMarkups([...markups, newMarkup]);
        // Reset to select after placing (optional)
        // setTool('select');
    };

    const handleSave = () => {
        alert(`Saved ${markups.length} markups to database!`);
    };

    return (
        <div className="relative w-full h-[600px] border bg-gray-100 overflow-hidden flex flex-col">
            {/* Toolbar Overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                <MarkupToolbar activeTool={tool} setTool={setTool} onSave={handleSave} />
            </div>

            {/* Viewer Canvas */}
            <div
                ref={containerRef}
                className="flex-1 relative cursor-crosshair overflow-auto"
                onClick={handleCanvasClick}
            >
                {/* Mock background image mimicking a drawing */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none select-none">
                    {fileUrl ? <img src={fileUrl} alt="Drawing" /> : (
                        <div className="text-4xl font-bold opacity-20 transform -rotate-45">
                            DRAWING PREVIEW
                        </div>
                    )}
                </div>

                {/* Render Markups */}
                {markups.map(m => (
                    <div
                        key={m.id}
                        className="absolute border-2 border-red-500 bg-red-500/10 flex items-center justify-center"
                        style={{
                            left: m.x,
                            top: m.y,
                            width: m.type === 'text' ? 'auto' : m.w,
                            height: m.type === 'text' ? 'auto' : m.h,
                            borderRadius: m.type === 'circle' ? '50%' : m.type === 'cloud' ? '20px' : '0',
                            borderStyle: m.type === 'cloud' ? 'dashed' : 'solid',
                        }}
                    >
                        {m.type === 'text' && <span className="text-red-700 font-bold p-2 bg-white/80">Sample Note</span>}
                        {m.type === 'cloud' && <span className="text-xs text-red-500">Cloud Rev</span>}
                    </div>
                ))}
            </div>

            <div className="p-2 text-xs text-gray-500 bg-white border-t">
                Mode: {tool.toUpperCase()} | Markups: {markups.length}
            </div>
        </div>
    );
}
