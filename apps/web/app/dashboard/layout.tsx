'use client';

import NavRail from '@/components/dashboard/NavRail';
import SidebarPanel from '@/components/dashboard/SidebarPanel';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <div className="h-screen w-full bg-[#bdc3c7] flex p-3 gap-3 overflow-hidden font-sans relative">
            {/* Blurred Background Graphic for Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-200 rounded-full blur-[120px] opacity-30"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-slate-300 rounded-full blur-[100px] opacity-40"></div>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden absolute top-5 left-5 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 bg-white/50 backdrop-blur-md rounded-lg shadow-sm border border-white/40 text-slate-700 hover:bg-white/80 transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                 <div className="fixed inset-0 z-40 bg-slate-200/90 backdrop-blur-lg flex p-3 gap-3 pt-16">
                     <NavRail className="flex h-full" />
                     <SidebarPanel className="flex-1 w-auto h-full" />
                 </div>
            )}

            {/* Column 1: Floating Tool Rail - Hidden on mobile */}
            <NavRail className="hidden md:flex" />

            {/* Column 2: Navigation Panel - Hidden on mobile */}
            <SidebarPanel className="hidden md:flex" />

            {/* Column 3: Main Dashboard Content */}
            <div className="flex-1 glass-panel rounded-[2rem] flex flex-col p-8 z-10 relative overflow-hidden pt-16 md:pt-8">
                {children}
            </div>
        </div>
    );
}
