'use client';

import { useState } from 'react';
import NavRail from '@/components/dashboard/NavRail';
import SidebarPanel from '@/components/dashboard/SidebarPanel';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="h-screen w-full bg-[#bdc3c7] flex p-3 gap-3 overflow-hidden font-sans relative">
            {/* Blurred Background Graphic for Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-200 rounded-full blur-[120px] opacity-30"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-slate-300 rounded-full blur-[100px] opacity-40"></div>
            </div>

            {/* Desktop Sidebar Wrapper - Hidden on Mobile */}
            <div className="hidden md:flex gap-3 h-full shrink-0">
                <NavRail />
                <SidebarPanel />
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-black/50 md:hidden backdrop-blur-sm">
                    <div className="flex h-full p-3 gap-3 overflow-hidden">
                        <div className="flex gap-3 h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <NavRail />
                            <SidebarPanel />
                        </div>

                        {/* Close Button Area (Click outside) */}
                        <div className="flex-1 h-full relative" onClick={() => setMobileMenuOpen(false)}>
                             <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMobileMenuOpen(false);
                                }}
                                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg text-slate-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Column 3: Main Dashboard Content */}
            <div className="flex-1 glass-panel rounded-[2rem] flex flex-col p-4 md:p-8 z-10 relative overflow-hidden min-w-0">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between mb-4">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 -ml-2 hover:bg-white/50 rounded-lg transition-colors text-slate-700"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-semibold text-slate-700">Rukon CDE</span>
                    <div className="w-8" /> {/* Spacer */}
                </div>

                {children}
            </div>
        </div>
    );
}
