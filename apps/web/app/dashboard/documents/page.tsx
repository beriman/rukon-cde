import { Files, Search, Upload, Filter, MoreVertical } from 'lucide-react';

export default function DocumentsPage() {
    const containers = [
        { id: 'wip', name: 'Work in Progress', count: 12, color: 'amber' },
        { id: 'shared', name: 'Shared', count: 8, color: 'blue' },
        { id: 'published', name: 'Published', count: 24, color: 'emerald' },
        { id: 'archive', name: 'Archive', count: 156, color: 'slate' },
    ];

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-slate-800 tracking-tight mb-1">
                        Documents
                    </h1>
                    <p className="text-sm text-slate-500 font-light">
                        CDE Document Containers (ISO 19650)
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
                    <Upload className="w-4 h-4" />
                    Upload
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="w-full pl-11 pr-4 py-3 glass-card rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                </div>
                <button className="px-4 py-3 glass-card rounded-xl text-slate-600 hover:bg-white/50 transition-colors">
                    <Filter className="w-4 h-4" />
                </button>
            </div>

            {/* Container Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {containers.map((container) => (
                    <div key={container.id} className="glass-card rounded-2xl p-5 hover:shadow-lg transition-shadow cursor-pointer group">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl bg-${container.color}-100 flex items-center justify-center`}>
                                <Files className={`w-5 h-5 text-${container.color}-600`} />
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                        <h3 className="font-medium text-slate-800 mb-1">{container.name}</h3>
                        <p className="text-2xl font-medium text-slate-900">{container.count}</p>
                        <p className="text-xs text-slate-400 mt-1">documents</p>
                    </div>
                ))}
            </div>

            {/* Document List Area */}
            <div className="glass-card rounded-2xl p-6 min-h-[300px]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-medium text-slate-800">Recent Documents</h2>
                    <span className="text-xs text-slate-400">Last 7 days</span>
                </div>
                <div className="flex items-center justify-center h-48 opacity-40">
                    <div className="text-center">
                        <Files className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">No documents yet</p>
                        <p className="text-xs text-slate-400 mt-1">Upload documents to get started</p>
                    </div>
                </div>
            </div>
        </>
    );
}
