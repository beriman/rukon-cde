'use client';

import Link from 'next/link';
import ProjectSelector from './ProjectSelector';
import { useProjectStore } from '@/stores/useProjectStore';
import { cn } from '@/lib/utils';
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
    Files,
    CheckCircle2,
    Box,
    Calendar,
    DollarSign,
    ShieldAlert,
    FileText,
} from 'lucide-react';

export default function SidebarPanel({ className }: { className?: string }) {
    const { activeProject } = useProjectStore();

    return (
        <div className={cn("w-72 glass-panel rounded-[2rem] flex flex-col p-5 z-10 relative overflow-hidden", className)}>
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
                {/* Main Navigation */}
                <div className="mb-6">
                    <p className="px-3 text-xs font-medium text-slate-400 mb-2">Main</p>
                    <ul className="space-y-1">
                        <li>
                            <Link href="/dashboard" className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-b from-white/80 to-white/40 shadow-sm border border-white/60 text-slate-800 text-sm font-medium group transition-all">
                                <div className="flex items-center gap-3">
                                    <LayoutDashboard className="w-4 h-4 text-slate-900" />
                                    Dashboard
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/projects" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors">
                                <Folder className="w-4 h-4 text-slate-500" />
                                Projects
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* CDE Containers */}
                <div className="mb-6">
                    <ProjectSelector />
                    <ul className={`space-y-1 transition-opacity ${!activeProject ? 'opacity-50 pointer-events-none' : ''}`}>
                        <li>
                            <Link href={activeProject ? `/dashboard/documents?container=wip&projectId=${activeProject.id}` : '#'} className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors group">
                                <div className="flex items-center gap-3">
                                    <Files className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                                    WIP (Work in Progress)
                                </div>
                                <span className="text-[10px] text-slate-400">12</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={activeProject ? `/dashboard/documents?container=shared&projectId=${activeProject.id}` : '#'} className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors group">
                                <div className="flex items-center gap-3">
                                    <Share className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                                    Shared
                                </div>
                                <span className="text-[10px] text-slate-400">8</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={activeProject ? `/dashboard/documents?container=published&projectId=${activeProject.id}` : '#'} className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors group">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                                    Published
                                </div>
                                <span className="text-[10px] text-slate-400">24</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={activeProject ? `/dashboard/documents?container=archive&projectId=${activeProject.id}` : '#'} className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors group">
                                <div className="flex items-center gap-3">
                                    <Archive className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                                    Archive
                                </div>
                                <span className="text-[10px] text-slate-400">156</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Project Data */}
                <div className="mb-6">
                    <p className="px-3 text-xs font-medium text-slate-400 mb-2">Project Data</p>
                    <ul className="space-y-1">
                        <li>
                            <Link href="/dashboard/bim" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors">
                                <Box className="w-4 h-4 text-slate-400" />
                                BIM Models
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/schedule" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                Schedule
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/cost" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors">
                                <DollarSign className="w-4 h-4 text-slate-400" />
                                Cost
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/hse" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors">
                                <ShieldAlert className="w-4 h-4 text-slate-400" />
                                HSE
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Management */}
                <div className="mb-6">
                    <p className="px-3 text-xs font-medium text-slate-400 mb-2">Management</p>
                    <ul className="space-y-1">
                        <li>
                            <Link href="/dashboard/users" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors">
                                <Users className="w-4 h-4 text-slate-400" />
                                Team & Users
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/reports" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-white/30 text-sm font-medium transition-colors">
                                <FileText className="w-4 h-4 text-slate-400" />
                                Reports
                            </Link>
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
