import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, PieChart } from 'lucide-react';

export default function CostPage() {
    const stats = [
        { label: 'Total Budget', value: 'Rp 15.2B', change: null, icon: DollarSign },
        { label: 'Spent', value: 'Rp 8.7B', change: '+12%', up: true, icon: TrendingUp },
        { label: 'Remaining', value: 'Rp 6.5B', change: '-8%', up: false, icon: TrendingDown },
        { label: 'Commitment', value: 'Rp 2.1B', change: null, icon: PieChart },
    ];

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-slate-800 tracking-tight mb-1">
                        Cost Management
                    </h1>
                    <p className="text-sm text-slate-500 font-light">
                        Budget tracking and financial overview
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
                    Export Report
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="glass-card rounded-2xl p-5 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-slate-600" />
                                </div>
                                {stat.change && (
                                    <span className={`text-xs font-medium ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {stat.change}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                            <p className="text-2xl font-medium text-slate-900">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="glass-card rounded-2xl p-6">
                    <h2 className="font-medium text-slate-800 mb-4">Monthly Expenditure</h2>
                    <div className="h-48 flex items-end justify-between gap-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 50].map((h, i) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-400">
                        <span>Jan</span>
                        <span>Dec</span>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6">
                    <h2 className="font-medium text-slate-800 mb-4">Cost Breakdown</h2>
                    <div className="space-y-3">
                        {[
                            { name: 'Materials', pct: 45, color: 'blue' },
                            { name: 'Labor', pct: 30, color: 'emerald' },
                            { name: 'Equipment', pct: 15, color: 'amber' },
                            { name: 'Other', pct: 10, color: 'slate' },
                        ].map((item) => (
                            <div key={item.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">{item.name}</span>
                                    <span className="text-slate-400">{item.pct}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full">
                                    <div className={`h-full bg-${item.color}-500 rounded-full`} style={{ width: `${item.pct}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
