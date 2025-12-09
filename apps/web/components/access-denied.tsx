'use client';

import { useRouter } from 'next/navigation';
import { XCircle, Shield } from 'lucide-react';
import Link from 'next/link';

export function AccessDenied() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                        <Shield className="w-12 h-12 text-red-600 dark:text-red-400" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    Access Denied
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    You don't have permission to access this page. This area is restricted to administrators only.
                </p>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
}
