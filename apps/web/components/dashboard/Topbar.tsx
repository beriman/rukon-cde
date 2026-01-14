'use client';

import { Search, Bell } from 'lucide-react';

export default function Topbar() {
    return (
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-4">
                {/* Global Search */}
                <div className="relative hidden sm:block w-64 md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search documents, projects..."
                        className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-transparent hover:border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none rounded-md transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative text-slate-500 hover:text-slate-700">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="h-6 w-px bg-slate-200"></div>
                <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
                    Help
                </button>
            </div>
        </header>
    );
}
