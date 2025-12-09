'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';
import {
    Users,
    FolderOpen,
    Settings,
    LogOut,
    Menu,
    Bell,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, token, logout } = useAuthStore();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    // Protected Route Logic
    useEffect(() => {
        if (!token) {
            router.push('/auth/login');
        }
    }, [token, router]);

    if (!token) return null;

    const navItems = [
        { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
        { name: 'Users', href: '/dashboard/users', icon: Users, adminOnly: true },
        { name: 'Audit Trail', href: '/dashboard/audit', icon: FileText, adminOnly: true },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
                    !isSidebarOpen && "-translate-x-full lg:hidden"
                )}
            >
                <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-white">
                        <div className="w-6 h-6 bg-blue-600 rounded-md"></div>
                        Rukon CDE
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems
                        .filter(item => !item.adminOnly || (user && ['ORG_ADMIN', 'SYSTEM_ADMIN'].includes(user.role)))
                        .map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-200 dark:border-zinc-800">
                    <button
                        onClick={() => { logout(); router.push('/auth/login'); }}
                        className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 lg:px-8">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-zinc-500 hover:text-zinc-700">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex-1"></div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-medium">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">{user?.name}</p>
                                <p className="text-xs text-zinc-500">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
