import { Box, Upload, Search, Eye, Download, MoreVertical } from 'lucide-react';

export default function BimPage() {
    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-slate-800 tracking-tight mb-1">
                        BIM Models
                    </h1>
                    <p className="text-sm text-slate-500 font-light">
                        View and manage 3D building information models
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

            {/* Model Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card rounded-2xl overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <Box className="w-12 h-12 text-slate-300" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium text-slate-800 mb-1">Model_{i}.ifc</h3>
                            <p className="text-xs text-slate-400 mb-3">Updated 2 days ago</p>
                            <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs hover:bg-slate-200 transition-colors">
                                    <Eye className="w-3 h-3" />
                                    View
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

            {/* Empty State */}
            <div className="glass-card rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
                <div className="text-center opacity-40">
                    <Box className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-sm text-slate-500">Upload IFC files to view 3D models</p>
                </div>
            </div>
        </>
    );
}
