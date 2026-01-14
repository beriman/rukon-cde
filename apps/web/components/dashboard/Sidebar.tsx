'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Folder,
    Files,
    Box,
    Calendar,
    ShieldAlert,
    Users,
    Settings,
} from 'lucide-react';

const navSections = [
    {
        title: 'Project Data',
        items: [
            { icon: Folder, label: 'Projects', href: '/dashboard/projects' },
            { icon: Files, label: 'Documents', href: '/dashboard/documents' },
            { icon: Box, label: 'BIM Models', href: '/dashboard/bim' },
        ],
    },
    {
        title: 'Management',
        items: [
            { icon: Calendar, label: 'Schedule', href: '/dashboard/schedule' },
            { icon: ShieldAlert, label: 'HSE', href: '/dashboard/hse' },
            { icon: Users, label: 'Users', href: '/dashboard/users' },
        ],
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-slate-50 border-r border-slate-200 transform -translate-x-full lg:translate-x-0 transition-transform duration-200 flex flex-col">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-200/50">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs mr-2">
                    R
                </div>
                <span className="font-semibold text-slate-900 tracking-tight">Rukon CDE</span>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                <Link
                    href="/dashboard"
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${pathname === '/dashboard'
                            ? 'bg-slate-100 text-blue-600'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                </Link>

                {navSections.map((section, idx) => (
                    <div key={idx}>
                        <div className="pt-4 pb-2 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            {section.title}
                        </div>
                        {section.items.map((item, itemIdx) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={itemIdx}
                                    href={item.href}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${isActive
                                            ? 'bg-slate-100 text-blue-600'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-200">
                <Link
                    href="/dashboard/settings"
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md mb-1 ${pathname === '/dashboard/settings'
                            ? 'bg-slate-100 text-blue-600'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                >
                    <Settings className="w-4 h-4" />
                    Settings
                </Link>
                <div className="flex items-center gap-3 px-3 py-3 mt-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                        JS
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">John Smith</p>
                        <p className="text-[10px] text-slate-500 truncate">BIM Manager</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
