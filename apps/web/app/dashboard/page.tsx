import { Maximize2, ArrowUp, ArrowRight, CornerLeftUp, CornerLeftDown, Search } from 'lucide-react';

export default function DashboardPage() {
    return (
        <>
            {/* Header Area */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-slate-800 tracking-tight mb-1">
                        Dashboard
                    </h1>
                    <p className="text-sm text-slate-500 font-light">
                        All Your Workflows And Permissions Managed
                    </p>
                </div>
                <div className="w-8 h-8 rounded-lg border border-slate-300/50 flex items-center justify-center text-slate-400">
                    <Maximize2 className="w-4 h-4" />
                </div>
            </div>

            {/* KPI Card */}
            <div className="w-full max-w-sm glass-card rounded-2xl p-6 mb-10 relative overflow-hidden group hover:shadow-lg transition-shadow duration-500">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-50 blur-2xl group-hover:opacity-80 transition-opacity"></div>

                <div className="relative z-10">
                    <p className="text-sm font-medium text-slate-600 mb-2">Executions</p>
                    <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-6xl font-normal text-slate-800 tracking-tighter">
                            340
                        </span>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold">
                            <ArrowUp className="w-3 h-3" /> 204%
                        </div>
                    </div>
                    <button className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors">
                        See Report <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Tabs & Section Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-medium text-slate-800 tracking-tight mb-6">
                    Executions
                </h2>
                <div className="flex items-center gap-8 border-b border-slate-200/60 pb-1 relative">
                    <button className="pb-3 text-sm font-medium text-slate-900 border-b-2 border-slate-800 -mb-1.5 px-1">
                        Workflows
                    </button>
                    <button className="pb-3 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors px-1">
                        Permissions
                    </button>
                    <button className="pb-3 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors px-1">
                        Executions
                    </button>
                </div>
            </div>

            {/* Search Content */}
            <div className="relative mb-6">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-slate-200/50 text-sm focus:outline-none focus:border-slate-400 placeholder:text-slate-300 transition-colors font-light"
                />
            </div>

            {/* Large Content Area (Empty State) */}
            <div className="flex-1 glass-card rounded-2xl p-8 border border-white/40 shadow-sm relative min-h-[300px]">
                <CornerLeftUp className="absolute top-4 left-4 w-4 h-4 text-slate-300" />
                <CornerLeftDown className="absolute bottom-4 left-4 w-4 h-4 text-slate-300" />

                <div className="absolute bottom-8 right-8 text-right opacity-40">
                    <p className="text-xs text-slate-500">Where dreams align</p>
                    <p className="text-xs text-slate-500">with your data.</p>
                </div>
            </div>
        </>
    );
}
