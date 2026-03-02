'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '../ui/button';
import { Pen, Type, Save, Undo, X, MousePointer2 } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfMarkupViewerProps {
    fileUrl: string;
    onSaveMarkup?: (markupData: any) => void;
    readOnly?: boolean;
}

type DrawMode = 'NONE' | 'DRAW' | 'TEXT';

export function PdfMarkupViewer({ fileUrl, onSaveMarkup, readOnly = false }: PdfMarkupViewerProps) {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [mode, setMode] = useState<DrawMode>('NONE');
    const [isDrawing, setIsDrawing] = useState(false);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    // Initialize Canvas
    useEffect(() => {
        if (readOnly || mode === 'NONE' || !canvasRef.current || !wrapperRef.current) return;
        
        const canvas = canvasRef.current;
        // Make canvas match the wrapper size (which fits the PDF page)
        canvas.width = wrapperRef.current.clientWidth;
        canvas.height = wrapperRef.current.clientHeight;
        
        const context = canvas.getContext('2d');
        if (context) {
            context.lineCap = 'round';
            context.strokeStyle = 'red';
            context.lineWidth = 3;
            contextRef.current = context;
        }
    }, [pageNumber, mode, readOnly]);

    const startDrawing = ({ nativeEvent }: React.MouseEvent) => {
        if (mode !== 'DRAW' || !contextRef.current) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }: React.MouseEvent) => {
        if (!isDrawing || mode !== 'DRAW' || !contextRef.current) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const stopDrawing = () => {
        if (mode !== 'DRAW' || !contextRef.current) return;
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const handleSave = () => {
        if (canvasRef.current && onSaveMarkup) {
            const dataUrl = canvasRef.current.toDataURL('image/png');
            onSaveMarkup({
                page: pageNumber,
                image: dataUrl,
                timestamp: new Date().toISOString()
            });
        }
    };

    const handleClear = () => {
        if (canvasRef.current && contextRef.current) {
            contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    return (
        <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg">
            {!readOnly && (
                <div className="flex gap-2 mb-4 bg-white p-2 rounded shadow-sm">
                    <Button 
                        variant={mode === 'NONE' ? 'default' : 'outline'} 
                        size="icon" 
                        onClick={() => setMode('NONE')}
                        title="Pointer"
                    >
                        <MousePointer2 className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant={mode === 'DRAW' ? 'default' : 'outline'} 
                        size="icon" 
                        onClick={() => setMode('DRAW')}
                        title="Draw (Red Pen)"
                    >
                        <Pen className="w-4 h-4" />
                    </Button>
                    <div className="w-px bg-gray-200 mx-2"></div>
                    <Button variant="outline" size="icon" onClick={handleClear} title="Clear Drawings">
                        <Undo className="w-4 h-4" />
                    </Button>
                    <Button variant="default" className="ml-2" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" /> Save Markup
                    </Button>
                </div>
            )}

            <div className="flex gap-4 items-center mb-4 text-sm">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                    disabled={pageNumber <= 1}
                >
                    Prev
                </Button>
                <span>Page {pageNumber} of {numPages || '--'}</span>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))}
                    disabled={pageNumber >= (numPages || 1)}
                >
                    Next
                </Button>
            </div>

            <div 
                ref={wrapperRef}
                className="relative shadow-xl bg-white" 
                style={{ cursor: mode === 'DRAW' ? 'crosshair' : 'default' }}
            >
                <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="max-w-full"
                    loading={<div className="p-20 text-center">Loading PDF...</div>}
                >
                    <Page 
                        pageNumber={pageNumber} 
                        renderTextLayer={false} 
                        renderAnnotationLayer={false} 
                        width={800} // Fixed width for predictable canvas overlay
                    />
                </Document>

                {mode !== 'NONE' && !readOnly && (
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="absolute top-0 left-0 w-full h-full z-10"
                        style={{ pointerEvents: mode === 'DRAW' ? 'auto' : 'none' }}
                    />
                )}
            </div>
        </div>
    );
}
