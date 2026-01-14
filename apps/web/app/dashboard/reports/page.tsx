import { FileText, Download, Calendar, Filter } from 'lucide-react';

export default function ReportsPage() {
    const reports = [
        { name: 'Monthly Progress Report', date: 'Jan 2026', type: 'Progress' },
        { name: 'Safety Audit Report', date: 'Dec 2025', type: 'HSE' },
        { name: 'Cost Summary Q4', date: 'Dec 2025', type: 'Financial' },
        { name: 'BIM Coordination Report', date: 'Nov 2025', type: 'Technical' },
    ];

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-slate-800 tracking-tight mb-1">
                        Reports
                    </h1>
                    <p className="text-sm text-slate-500 font-light">
                        Generate and download project reports
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
                    <FileText className="w-4 h-4" />
                    Generate Report
                </button>
            </div>

            {/* Filter */}
            <div className="flex gap-3 mb-6">
                <button className="px-4 py-2 glass-card rounded-xl text-sm text-slate-600 hover:bg-white/50 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date Range
                </button>
                <button className="px-4 py-2 glass-card rounded-xl text-sm text-slate-600 hover:bg-white/50 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Type
                </button>
            </div>

            {/* Reports List */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50/50 text-xs font-medium text-slate-500 border-b border-slate-200/50">
                    <span>Report Name</span>
                    <span>Date</span>
                    <span>Type</span>
                    <span className="text-right">Actions</span>
                </div>
                {reports.map((report, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-white/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-800">{report.name}</span>
                        </div>
                        <span className="text-sm text-slate-500">{report.date}</span>
                        <span className="text-sm text-slate-500">{report.type}</span>
                        <div className="text-right">
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <Download className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            <div className="glass-card rounded-2xl p-8 mt-4 flex items-center justify-center opacity-40">
                <div className="text-center">
                    <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">More reports coming soon</p>
                </div>
            </div>
        </>
    );
}
