import { ShieldAlert, ArrowUp, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function HsePage() {
    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-slate-800 tracking-tight mb-1">
                        Health, Safety & Environment
                    </h1>
                    <p className="text-sm text-slate-500 font-light">
                        Monitor safety metrics and compliance across projects
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Safety Score */}
                <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-full opacity-50 blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-slate-500">Safety Score</p>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-medium text-slate-800">94</span>
                            <span className="text-xs text-emerald-600 flex items-center gap-1">
                                <ArrowUp className="w-3 h-3" /> 2%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Days Incident Free */}
                <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-50 blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-slate-500">Days Incident Free</p>
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-medium text-slate-800">127</span>
                        </div>
                    </div>
                </div>

                {/* Open Observations */}
                <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-amber-100 to-transparent rounded-full opacity-50 blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-slate-500">Open Observations</p>
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-medium text-slate-800">8</span>
                        </div>
                    </div>
                </div>

                {/* Compliance Rate */}
                <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-slate-100 to-transparent rounded-full opacity-50 blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-slate-500">Compliance Rate</p>
                            <ShieldAlert className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-medium text-slate-800">98%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="glass-card rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center opacity-40">
                    <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-sm text-slate-500">HSE Dashboard</p>
                    <p className="text-xs text-slate-400 mt-1">Safety metrics and compliance tracking</p>
                </div>
            </div>
        </>
    );
}
