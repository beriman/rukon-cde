'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../hooks/useAuth';

export default function DashboardPage() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <span className="text-xl font-bold text-indigo-600">Rukon CDE</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 text-sm text-gray-700">Welcome, {user?.name}</span>
                            <button
                                onClick={() => {
                                    logout();
                                    router.push('/login');
                                }}
                                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-10">
                <header>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                            Dashboard
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {/* Your content */}
                        <div className="px-4 py-8 sm:px-0">
                            <div className="rounded-lg border-4 border-dashed border-gray-200 h-96 flex items-center justify-center text-gray-400">
                                Project List will appear here (Sprint 2)
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
