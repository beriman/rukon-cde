import { Maximize2 } from 'lucide-react';
import { DashboardOverview } from './_components/DashboardOverview';

export default function DashboardPage() {
    return (
        <>
            {/* Header Area */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-medium text-slate-800 tracking-tight mb-1">
                        My Dashboard
                    </h1>
                    <p className="text-sm text-slate-500 font-light">
                        Overview of your projects and assigned tasks
                    </p>
                </div>
                <div className="w-8 h-8 rounded-lg border border-slate-300/50 flex items-center justify-center text-slate-400">
                    <Maximize2 className="w-4 h-4" />
                </div>
            </div>

            <DashboardOverview />
        </>
    );
}
