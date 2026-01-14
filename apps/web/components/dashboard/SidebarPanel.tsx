'use client';

import {
    LayoutDashboard,
    Library,
    Share,
    CircleDot,
    RefreshCw,
    Users,
    Clock,
    Archive,
    Plus,
    Search,
    Folder,
    FolderOpen,
    ChevronDown,
} from 'lucide-react';

export default function SidebarPanel() {
    return (
        <div className="w-72 glass-panel rounded-[2rem] flex flex-col p-5 z-10 relative overflow-hidden">
            {/* Mac-like Window Controls */}
            <div className="flex gap-2 mb-6 px-1">
                <div className="w-3 h-3 rounded-full bg-red-400/80 border border-red-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400/80 border border-emerald-500/20"></div>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 mb-8 px-1">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-300 overflow-hidden border border-white shadow-sm">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#e4e5e7] rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <button className="flex items-center gap-1 text-sm font-medium text-slate-800 hover:text-black">
                        John Doe <ChevronDown className="w-3 h-3 opacity-50" />
                    </button>
                    <p className="text-[10px] text-slate-500 truncate font-mono">
                        customer@rukon.io
                    </p>
                </div>
            </div>

            {/* Scrollable Menu Area */}
            <div className="flex-1 overflow-y-auto hide-scrollbar -mx-2 px-2">
                {/* Projects Group */}
                <div className="mb-6">
                    <p className="px-3 text-xs font-medium text-slate-400 mb-2">Projects</p>
                    <ul className="space-y-1">
                        <li>
                            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-b from-white/80 to-white/40 shadow-sm border border-white/60 text-slate-800 text-sm font-medium group transition-all">
                                <div className="flex items-center gap-3">
                                    <LayoutDashboard className="w-4 h-4 text-slate-900" />
                                    Dashboard
                                </div>
                                <span className="text-[10px] text-slate-400 bg-white/50 px-1.5 py-0.5 rounded-md border border-white/20">
                                    0
                                </span>
                            </button>
                        </li>
                        <li>
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors">
                                <Library className="w-4 h-4 text-slate-500" />
                                Library
                            </button>
                        </li>
                        <li>
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors">
                                <Share className="w-4 h-4 text-slate-500" />
                                Shared Projects
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Status Group */}
                <div className="mb-6">
                    <p className="px-3 text-xs font-medium text-slate-400 mb-2">Status</p>
                    <ul className="space-y-1">
                        <li>
                            <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors group">
                                <div className="flex items-center gap-3">
                                    <CircleDot className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                                    New
                                </div>
                                <span className="text-[10px] text-slate-400">3</span>
                            </button>
                        </li>
                        <li>
                            <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors group">
                                <div className="flex items-center gap-3">
                                    <RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                                    Updates
                                </div>
                                <span className="text-[10px] text-slate-400">2</span>
                            </button>
                        </li>
                        <li>
                            <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors group">
                                <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                                    Team Review
                                </div>
                            </button>
                        </li>
                    </ul>
                </div>

                {/* History Group */}
                <div className="mb-6">
                    <p className="px-3 text-xs font-medium text-slate-400 mb-2">History</p>
                    <ul className="space-y-1">
                        <li>
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors">
                                <Clock className="w-4 h-4 text-slate-400" />
                                Recently Edited
                            </button>
                        </li>
                        <li>
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors">
                                <Archive className="w-4 h-4 text-slate-400" />
                                Archive
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Documents Bottom Section */}
            <div className="pt-4 border-t border-slate-200/50">
                <div className="flex items-center justify-between px-1 mb-3">
                    <span className="text-xs font-medium text-slate-400">Documents</span>
                    <button className="text-slate-400 hover:text-slate-600">
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-4 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100/50 border border-slate-200/50 rounded-xl focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-1 focus:ring-slate-200 transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* Folder Tree */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/40 text-xs text-slate-600 cursor-pointer group">
                        <div className="flex items-center gap-2">
                            <Folder className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                            System Management's
                        </div>
                        <span className="text-[10px] text-slate-400">12</span>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-black/5 text-xs text-slate-900 font-medium cursor-pointer mt-1">
                        <div className="flex items-center gap-2">
                            <FolderOpen className="w-3.5 h-3.5 text-slate-700" />
                            Fundamentals
                        </div>
                        <span className="text-[10px] text-slate-500">4</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
