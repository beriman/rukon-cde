import { Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SchedulePage() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-slate-800 tracking-tight mb-1">
                        Schedule
                    </h1>
                    <p className="text-sm text-slate-500 font-light">
                        Project timeline and milestones
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Task
                </button>
            </div>

            {/* Timeline Header */}
            <div className="glass-card rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                            <ChevronLeft className="w-4 h-4 text-slate-600" />
                        </button>
                        <span className="font-medium text-slate-800">2026</span>
                        <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs bg-slate-900 text-white rounded-lg">Gantt</button>
                        <button className="px-3 py-1.5 text-xs text-slate-600 hover:bg-white/50 rounded-lg">Calendar</button>
                        <button className="px-3 py-1.5 text-xs text-slate-600 hover:bg-white/50 rounded-lg">List</button>
                    </div>
                </div>

                {/* Months Bar */}
                <div className="flex border-b border-slate-200/50">
                    {months.map((month) => (
                        <div key={month} className="flex-1 text-center py-2 text-xs text-slate-500">
                            {month}
                        </div>
                    ))}
                </div>
            </div>

            {/* Gantt Placeholder */}
            <div className="glass-card rounded-2xl p-6 min-h-[400px]">
                <div className="space-y-3">
                    {['Design Phase', 'Foundation', 'Structure', 'MEP Installation', 'Finishing'].map((task, i) => (
                        <div key={task} className="flex items-center gap-4">
                            <div className="w-32 text-sm text-slate-600 truncate">{task}</div>
                            <div className="flex-1 h-8 bg-slate-100 rounded-lg relative">
                                <div
                                    className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg"
                                    style={{ left: `${i * 15}%`, width: `${30 + i * 5}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center h-32 opacity-40 mt-8">
                    <div className="text-center">
                        <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">Interactive schedule coming soon</p>
                    </div>
                </div>
            </div>
        </>
    );
}
