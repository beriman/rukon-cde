'use client';

import React, { useState, useEffect } from 'react';
import { Box, Upload, Search, Eye, Download, Loader2 } from 'lucide-react';
import { IfcViewer } from '@/components/viewer/IfcViewer';
import axios from 'axios';

// Mock current project ID - In production, this would come from a context or URL
const PROJECT_ID = 'your-project-id-here';

export default function BimPage() {
    const [models, setModels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedModel, setSelectedModel] = useState<any | null>(null);

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        try {
            setLoading(true);
            // In a real scenario, we'd fetch files with discipline 'BIM' or extensions .ifc
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects/${PROJECT_ID}/files`);
            const ifcFiles = response.data.filter((f: any) => f.name.toLowerCase().endsWith('.ifc'));
            setModels(ifcFiles);
        } catch (error) {
            console.error('Failed to fetch models', error);
        } finally {
            setLoading(false);
        }
    };

    if (selectedModel) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => setSelectedModel(null)}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2"
                    >
                        ← Back to List
                    </button>
                    <h2 className="font-semibold text-slate-800">{selectedModel.name}</h2>
                    <div />
                </div>
                <div className="flex-1">
                    <IfcViewer
                        modelUrls={[`${process.env.NEXT_PUBLIC_API_URL}/files/${selectedModel.id}/download`]}
                        projectId={PROJECT_ID}
                        fileId={selectedModel.id}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-2">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-slate-800 tracking-tight mb-1">
                        BIM Models
                    </h1>
                    <p className="text-sm text-slate-500 font-light">
                        View and manage 4D & 5D building information models
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
                    <Upload className="w-4 h-4" />
                    Upload IFC
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search models..."
                    className="w-full pl-11 pr-4 py-3 glass-card rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                </div>
            ) : models.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {models.map((model) => (
                        <div key={model.id} className="glass-card rounded-2xl overflow-hidden group hover:shadow-lg transition-shadow">
                            <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                <Box className="w-12 h-12 text-slate-300" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium text-slate-800 mb-1">{model.name}</h3>
                                <p className="text-xs text-slate-400 mb-3">
                                    Status: <span className="font-semibold text-blue-500">{model.cdeState}</span> • Version: {model.currentVersion}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedModel(model)}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-900 text-white rounded-lg text-xs hover:bg-slate-800 transition-colors"
                                    >
                                        <Eye className="w-3 h-3" />
                                        View 5D
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs hover:bg-slate-200 transition-colors">
                                        <Download className="w-3 h-3" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center opacity-40">
                        <Box className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-sm text-slate-500">No IFC models found in this project.</p>
                        <p className="text-xs text-slate-400 mt-1">Upload an IFC file to the documents section first.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
