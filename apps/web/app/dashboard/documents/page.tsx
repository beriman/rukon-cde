'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProjectStore } from '@/stores/useProjectStore';
import {
    Files,
    Search,
    Upload,
    Folder,
    FolderOpen,
    ChevronRight,
    ChevronDown,
    Lock,
    Users,
    Eye,
    FileText,
    Box,
    Calendar,
    ClipboardCheck,
    BarChart3,
    Shield,
    HardDrive,
    MoreVertical,
    Plus
} from 'lucide-react';

// ISO 19650 CDE Container Types
type ContainerType = 'wip' | 'shared' | 'published' | 'archive';

// Stakeholder Types
type Stakeholder = 'owner' | 'pengawas' | 'perencana' | 'kontraktor' | 'user';

// Document Categories based on ISO 19650
const documentCategories = [
    { id: '01', name: 'Informasi', icon: FileText },
    { id: '02', name: 'DED', icon: FileText },
    { id: '03', name: 'Shop Drawing', icon: FileText },
    { id: '04', name: 'As Built Drawing', icon: FileText },
    { id: '05', name: 'BIM 4D (Scheduling)', icon: Calendar },
    { id: '06', name: 'BIM 5D (QTO)', icon: BarChart3 },
    { id: '07', name: 'QA & QC', icon: ClipboardCheck },
    { id: '08', name: 'Progres Proyek', icon: BarChart3 },
    { id: '09', name: 'Dokumen BIM', icon: Box },
    { id: '10', name: 'K3LL', icon: Shield },
    { id: '11', name: 'Backup Data', icon: HardDrive },
];

// Stakeholder definitions with access rules
const stakeholders: { id: Stakeholder; name: string; color: string }[] = [
    { id: 'owner', name: 'Owner', color: 'blue' },
    { id: 'pengawas', name: 'Pengawas', color: 'emerald' },
    { id: 'perencana', name: 'Perencana', color: 'violet' },
    { id: 'kontraktor', name: 'Kontraktor', color: 'amber' },
    { id: 'user', name: 'User', color: 'slate' },
];

// Access rules per container
const containerAccess: Record<ContainerType, {
    name: string;
    description: string;
    stakeholders: Stakeholder[] | 'self-only' | 'all';
    color: string;
}> = {
    wip: {
        name: 'Work in Progress',
        description: 'Dokumen sedang dikerjakan - hanya stakeholder terkait yang dapat mengakses folder masing-masing',
        stakeholders: 'self-only', // Each stakeholder can only see their own folder
        color: 'amber'
    },
    shared: {
        name: 'Shared',
        description: 'Dokumen yang dibagikan untuk koordinasi - hanya Pengawas dan Kontraktor',
        stakeholders: ['pengawas', 'kontraktor'],
        color: 'blue'
    },
    published: {
        name: 'Published',
        description: 'Dokumen yang sudah disetujui - dapat diakses semua stakeholder',
        stakeholders: 'all',
        color: 'emerald'
    },
    archive: {
        name: 'Archive',
        description: 'Dokumen arsip proyek - hanya untuk referensi',
        stakeholders: 'all',
        color: 'slate'
    },
};

export default function DocumentsPage() {
    const searchParams = useSearchParams();
    const { activeProject } = useProjectStore();
    const [activeContainer, setActiveContainer] = useState<ContainerType>('wip');
    const [expandedFolders, setExpandedFolders] = useState<string[]>(['kontraktor']);
    const [currentUserStakeholder] = useState<Stakeholder>('kontraktor'); // Simulated current user

    useEffect(() => {
        const container = searchParams.get('container') as ContainerType;
        if (container && containerAccess[container]) {
            setActiveContainer(container);
        }
    }, [searchParams]);

    const toggleFolder = (folderId: string) => {
        setExpandedFolders(prev =>
            prev.includes(folderId)
                ? prev.filter(id => id !== folderId)
                : [...prev, folderId]
        );
    };

    // Get visible stakeholders based on container access rules
    const getVisibleStakeholders = () => {
        const access = containerAccess[activeContainer];
        if (access.stakeholders === 'all') {
            return stakeholders;
        } else if (access.stakeholders === 'self-only') {
            // In WIP, each stakeholder only sees their own folder
            return stakeholders.filter(s => s.id === currentUserStakeholder);
        } else {
            return stakeholders.filter(s => access.stakeholders.includes(s.id));
        }
    };

    const visibleStakeholders = getVisibleStakeholders();

    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-medium text-slate-800 tracking-tight mb-1">
                        Documents
                    </h1>
                    <p className="text-sm text-slate-500 font-light">
                        Common Data Environment (ISO 19650)
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
                    <Upload className="w-4 h-4" />
                    Upload
                </button>
            </div>

            {/* Container Tabs */}
            <div className="flex gap-2 mb-6">
                {(Object.keys(containerAccess) as ContainerType[]).map((container) => {
                    const info = containerAccess[container];
                    const isActive = activeContainer === container;
                    return (
                        <button
                            key={container}
                            onClick={() => setActiveContainer(container)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${isActive
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : 'glass-card text-slate-600 hover:bg-white/50'
                                }`}
                        >
                            <div className={`w-2 h-2 rounded-full bg-${info.color}-500`}></div>
                            {info.name}
                        </button>
                    );
                })}
            </div>

            {/* Access Info Banner */}
            <div className="glass-card rounded-xl p-4 mb-6 flex items-center gap-3">
                {containerAccess[activeContainer].stakeholders === 'self-only' ? (
                    <Lock className="w-5 h-5 text-amber-500" />
                ) : containerAccess[activeContainer].stakeholders === 'all' ? (
                    <Eye className="w-5 h-5 text-emerald-500" />
                ) : (
                    <Users className="w-5 h-5 text-blue-500" />
                )}
                <div>
                    <p className="text-sm text-slate-700 font-medium">
                        {containerAccess[activeContainer].name}
                    </p>
                    <p className="text-xs text-slate-500">
                        {containerAccess[activeContainer].description}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search documents..."
                    className="w-full pl-11 pr-4 py-3 glass-card rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
            </div>

            {/* Folder Tree */}
            <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-medium text-slate-800">
                        {containerAccess[activeContainer].name}
                    </h2>
                    <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                        <Plus className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                <div className="space-y-1">
                    {visibleStakeholders.map((stakeholder) => {
                        const isExpanded = expandedFolders.includes(stakeholder.id);
                        const isCurrentUser = stakeholder.id === currentUserStakeholder;

                        return (
                            <div key={stakeholder.id}>
                                {/* Stakeholder Folder */}
                                <button
                                    onClick={() => toggleFolder(stakeholder.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all group ${isExpanded
                                            ? 'bg-gradient-to-b from-white/80 to-white/40 shadow-sm border border-white/60'
                                            : 'hover:bg-white/30'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {isExpanded ? (
                                            <ChevronDown className="w-4 h-4 text-slate-400" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-slate-400" />
                                        )}
                                        {isExpanded ? (
                                            <FolderOpen className={`w-5 h-5 text-${stakeholder.color}-500`} />
                                        ) : (
                                            <Folder className={`w-5 h-5 text-${stakeholder.color}-400`} />
                                        )}
                                        <span className="font-medium text-slate-700">
                                            {stakeholder.name}
                                        </span>
                                        {isCurrentUser && activeContainer === 'wip' && (
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                                You
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">{documentCategories.length} folders</span>
                                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded transition-all">
                                            <MoreVertical className="w-3.5 h-3.5 text-slate-400" />
                                        </button>
                                    </div>
                                </button>

                                {/* Document Categories */}
                                {isExpanded && (
                                    <div className="ml-8 mt-1 space-y-0.5">
                                        {documentCategories.map((category) => {
                                            const Icon = category.icon;
                                            return (
                                                <button
                                                    key={category.id}
                                                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-white/40 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Folder className="w-4 h-4 text-slate-400" />
                                                        <span>{category.id} {category.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-slate-400">0 files</span>
                                                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded transition-all">
                                                            <MoreVertical className="w-3 h-3 text-slate-400" />
                                                        </button>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Empty State for restricted containers */}
                {visibleStakeholders.length === 0 && (
                    <div className="flex items-center justify-center py-12 opacity-40">
                        <div className="text-center">
                            <Lock className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                            <p className="text-sm text-slate-500">Anda tidak memiliki akses ke container ini</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="mt-6 glass-card rounded-xl p-4">
                <p className="text-xs font-medium text-slate-500 mb-3">Access Legend (ISO 19650)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span className="text-slate-600">WIP - Self Only</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-slate-600">Shared - Pengawas & Kontraktor</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-slate-600">Published - All</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                        <span className="text-slate-600">Archive - Read Only</span>
                    </div>
                </div>
            </div>
        </>
    );
}
