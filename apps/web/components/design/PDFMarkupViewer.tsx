'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pen, Cloud, ArrowRight, Save, Undo, Eraser } from 'lucide-react';

interface Point {
    x: number;
    y: number;
}

interface Markup {
    type: 'pen' | 'cloud' | 'arrow';
    points: Point[];
    color: string;
}

export function PDFMarkupViewer({ fileUrl }: { fileUrl: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState<'pen' | 'cloud' | 'arrow'>('pen');
    const [markups, setMarkups] = useState<Markup[]>([]);
    const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

    // Determine canvas context
    const getContext = () => canvasRef.current?.getContext('2d');

    const startDrawing = (e: React.MouseEvent) => {
        setIsDrawing(true);
        const { offsetX, offsetY } = e.nativeEvent;
        setCurrentPoints([{ x: offsetX, y: offsetY }]);
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = getContext();
        if (!ctx) return;

        setCurrentPoints(prev => [...prev, { x: offsetX, y: offsetY }]);

        // Live feedback
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        if (tool === 'pen') {
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
        }
        // For shapes like Cloud/Arrow, we usually clear and redraw, 
        // but for MVP Pen is simplest live.
        // Complex shapes would be drawn on mouseUp.
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        setMarkups(prev => [...prev, { type: tool, points: currentPoints, color: 'red' }]);
        setCurrentPoints([]);
    };

    const clearCanvas = () => {
        const ctx = getContext();
        if (ctx && canvasRef.current) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            setMarkups([]);
        }
    };

    // Re-draw all markups when state changes
    useEffect(() => {
        const ctx = getContext();
        if (!ctx || !canvasRef.current) return;

        // Clear
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw saved markups
        markups.forEach(m => {
            ctx.beginPath();
            ctx.strokeStyle = m.color;
            ctx.lineWidth = 2;
            if (m.points.length > 0) {
                ctx.moveTo(m.points[0].x, m.points[0].y);
                m.points.forEach(p => ctx.lineTo(p.x, p.y));
            }
            if (m.type === 'cloud') {
                ctx.closePath(); // Simple cloud closed loop
                // Real cloud would utilize bezier curves
            }
            ctx.stroke();
        });

    }, [markups]);

    const saveMarkups = async () => {
        console.log('Saving markups:', markups);
        alert('Markups saved locally (Mock)!');
        // TODO: POST /api/design/markups
    };

    return (
        <Card className="w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between py-2">
                <CardTitle className="text-lg">Review & Markup</CardTitle>
                <div className="flex gap-2">
                    <Button variant={tool === 'pen' ? 'default' : 'outline'} size="sm" onClick={() => setTool('pen')}>
                        <Pen className="h-4 w-4" />
                    </Button>
                    <Button variant={tool === 'cloud' ? 'default' : 'outline'} size="sm" onClick={() => setTool('cloud')}>
                        <Cloud className="h-4 w-4" />
                    </Button>
                    <Button variant={tool === 'arrow' ? 'default' : 'outline'} size="sm" onClick={() => setTool('arrow')}>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-gray-300 mx-2" />
                    <Button variant="ghost" size="sm" onClick={clearCanvas}>
                        <Eraser className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={saveMarkups}>
                        <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="relative bg-gray-100 min-h-[500px] flex justify-center items-center overflow-auto p-0">
                {/* Background Image/PDF Placeholder */}
                <div className="relative w-[800px] h-[600px] bg-white shadow-lg">
                    {/* In real app, typical logic: 
                        <img src={fileUrl} className="absolute inset-0 w-full h-full object-contain" />
                        For now, a placeholder div 
                     */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none">
                        [PDF DOCUMENT CONTENT: {fileUrl}]
                    </div>

                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        className="absolute inset-0 cursor-crosshair z-10"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
