'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Sparkles,
    Home,
    FolderKanban,
    Files,
    Users2,
    Layers,
    Box,
    Settings2,
} from 'lucide-react';

const navItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: FolderKanban, label: 'Projects', href: '/dashboard/projects' },
    { icon: Files, label: 'Documents', href: '/dashboard/documents' },
    { icon: Users2, label: 'Team', href: '/dashboard/users' },
    { icon: Layers, label: 'BIM Models', href: '/dashboard/bim' },
    { icon: Box, label: 'Assets', href: '/dashboard/assets' },
];

export default function NavRail({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <div className={cn("flex flex-col justify-between w-18 shrink-0 gap-2 z-10 items-center py-1", className)}>
            {/* Top Nav Pill */}
            <div className="bg-[#1a1a1a] rounded-full flex flex-col items-center py-5 gap-6 text-white/50 w-14 shadow-2xl shadow-black/20">
                {/* Logo */}
                <Link href="/" className="text-white hover:text-white mb-2 transition-colors">
                    <Sparkles className="w-5 h-5" />
                </Link>

                {/* Nav Items */}
                {navItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href ||
                        (item.href !== '/dashboard' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            className={`hover:text-white transition-colors group relative ${isActive ? 'text-white' : ''
                                }`}
                        >
                            {isActive && (
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                            )}
                            <Icon className="w-5 h-5" />
                            <span className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* Vertical Label */}
            <div className="flex-1 flex items-center justify-center py-4">
                <div className="vertical-text text-[10px] tracking-[0.2em] font-medium text-slate-500 uppercase opacity-60 select-none">
                    Rukon CDE
                </div>
            </div>

            {/* Bottom Settings */}
            <Link
                href="/dashboard/settings"
                className={`bg-[#1a1a1a] w-14 h-14 rounded-[1.2rem] flex items-center justify-center transition-colors shadow-lg shadow-black/20 group relative ${pathname === '/dashboard/settings' ? 'text-white' : 'text-white/50 hover:text-white'
                    }`}
            >
                <Settings2 className="w-5 h-5" />
                <span className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    Settings
                </span>
            </Link>
        </div>
    );
}
