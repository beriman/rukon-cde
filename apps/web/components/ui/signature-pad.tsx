'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Eraser, PenTool } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface SignaturePadProps {
    onChange: (value: string | null) => void;
}

export function SignaturePad({ onChange }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [activeTab, setActiveTab] = useState('draw');

    // Draw Logic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
    }, []);

    const startDrawing = (e: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            const canvas = canvasRef.current;
            if (canvas) {
                onChange(canvas.toDataURL('image/png'));
            }
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onChange(null);
    };

    // Upload Logic
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="border rounded-lg p-4 bg-white">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="draw" className="flex items-center gap-2">
                        <PenTool className="h-4 w-4" /> Draw
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" /> Upload
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="draw" className="space-y-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 touch-none">
                        <canvas
                            ref={canvasRef}
                            width={400}
                            height={200}
                            className="w-full h-[200px] cursor-crosshair rounded-lg"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={clearCanvas}>
                            <Eraser className="mr-2 h-4 w-4" /> Clear
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                        Draw your signature above using mouse or touch.
                    </p>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                    <div className="flex flex-col items-center justify-center h-[200px] border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
                        <Upload className="h-10 w-10 text-slate-400 mb-2" />
                        <Label htmlFor="sig-upload" className="cursor-pointer">
                            <span className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                                Choose Image
                            </span>
                            <input
                                id="sig-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleUpload}
                            />
                        </Label>
                        <p className="text-xs text-slate-500 mt-2">PNG, JPG up to 2MB</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
