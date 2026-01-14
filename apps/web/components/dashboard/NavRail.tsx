'use client';

import {
    Sparkles,
    Home,
    Globe,
    LayoutGrid,
    Share2,
    Layers,
    Box,
    Settings2,
} from 'lucide-react';

const navItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: Globe, label: 'Global', href: '/dashboard/global' },
    { icon: LayoutGrid, label: 'Apps', href: '/dashboard', active: true },
    { icon: Share2, label: 'Connect', href: '/dashboard/connect' },
    { icon: Layers, label: 'Layers', href: '/dashboard/layers' },
    { icon: Box, label: 'Assets', href: '/dashboard/assets' },
];

export default function NavRail() {
    return (
        <div className="flex flex-col justify-between w-18 shrink-0 gap-2 z-10 items-center py-1">
            {/* Top Nav Pill */}
            <div className="bg-[#1a1a1a] rounded-full flex flex-col items-center py-5 gap-6 text-white/50 w-14 shadow-2xl shadow-black/20">
                {/* Logo */}
                <button className="text-white hover:text-white mb-2 transition-colors">
                    <Sparkles className="w-5 h-5" />
                </button>

                {/* Nav Items */}
                {navItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={idx}
                            className={`hover:text-white transition-colors group relative ${item.active ? 'text-white' : ''
                                }`}
                        >
                            {item.active && (
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                            )}
                            <Icon className="w-5 h-5" />
                            <span className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Vertical Label */}
            <div className="flex-1 flex items-center justify-center py-4">
                <div className="vertical-text text-[10px] tracking-[0.2em] font-medium text-slate-500 uppercase opacity-60 select-none">
                    Rukon 2025 Nav
                </div>
            </div>

            {/* Bottom Settings */}
            <button className="bg-[#1a1a1a] w-14 h-14 rounded-[1.2rem] flex items-center justify-center text-white/50 hover:text-white transition-colors shadow-lg shadow-black/20 group relative">
                <Settings2 className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
                <span className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    Settings
                </span>
            </button>
        </div>
    );
}
