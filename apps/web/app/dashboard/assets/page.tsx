import { Box, Upload, Search, Grid, List, FolderOpen } from 'lucide-react';

export default function AssetsPage() {
    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-slate-800 tracking-tight mb-1">
                        Assets
                    </h1>
                    <p className="text-sm text-slate-500 font-light">
                        Manage project files and resources
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
                    <Upload className="w-4 h-4" />
                    Upload
                </button>
            </div>

            {/* Search & View Toggle */}
            <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="w-full pl-11 pr-4 py-3 glass-card rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                </div>
                <div className="flex glass-card rounded-xl overflow-hidden">
                    <button className="px-3 py-2 bg-slate-900 text-white">
                        <Grid className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-2 text-slate-400 hover:text-slate-600">
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Folder Structure */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Sidebar */}
                <div className="glass-card rounded-2xl p-4">
                    <h3 className="text-sm font-medium text-slate-800 mb-3">Folders</h3>
                    <div className="space-y-1">
                        {['Drawings', 'Documents', 'Images', 'Models', 'Reports'].map((folder) => (
                            <button key={folder} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-white/50 rounded-lg transition-colors">
                                <FolderOpen className="w-4 h-4 text-slate-400" />
                                {folder}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 glass-card rounded-2xl p-6 min-h-[400px]">
                    <div className="flex items-center justify-center h-full opacity-40">
                        <div className="text-center">
                            <Box className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-sm text-slate-500">No assets yet</p>
                            <p className="text-xs text-slate-400 mt-1">Upload files to get started</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
