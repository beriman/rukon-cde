'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/useAuthStore';
import { AccessDenied } from '@/components/access-denied';
import { Calendar, User as UserIcon, Activity, Filter, Download, Loader2, ChevronDown } from 'lucide-react';

interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    entityType: string;
    entityId: string;
    details: any;
    createdAt: string;
}

export default function AuditTrailPage() {
    const router = useRouter();
    const { user: currentUser } = useAuthStore();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedAction, setSelectedAction] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // RBAC: Only admins can access
    const hasAccess = currentUser && ['ORG_ADMIN', 'SYSTEM_ADMIN'].includes(currentUser.role);

    useEffect(() => {
        if (currentUser && !hasAccess) {
            router.push('/dashboard');
        }
    }, [currentUser, hasAccess, router]);

    useEffect(() => {
        if (hasAccess) {
            fetchLogs();
        }
    }, [page, selectedUser, selectedAction, startDate, endDate, hasAccess]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params: any = { page, limit: 50 };
            if (selectedUser) params.userId = selectedUser;
            if (selectedAction) params.action = selectedAction;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await apiClient.get('/audit-logs', { params });
            setLogs(res.data.logs || res.data);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error('Failed to fetch audit logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const getActionBadge = (action: string) => {
        const colors: Record<string, string> = {
            LOGIN: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            LOGOUT: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400',
            UPLOAD: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            DELETE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            UPDATE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            PROMOTE: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            PUBLISH: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
        };
        return colors[action] || 'bg-zinc-100 text-zinc-800';
    };

    if (!hasAccess) {
        return <AccessDenied />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Audit Trail</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Monitor all system activities and user actions</p>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Action Type
                        </label>
                        <select
                            value={selectedAction}
                            onChange={(e) => {
                                setSelectedAction(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            <option value="">All Actions</option>
                            <option value="LOGIN">Login</option>
                            <option value="LOGOUT">Logout</option>
                            <option value="UPLOAD">Upload</option>
                            <option value="DELETE">Delete</option>
                            <option value="UPDATE">Update</option>
                            <option value="PROMOTE">Promote</option>
                            <option value="PUBLISH">Publish</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setSelectedUser('');
                                setSelectedAction('');
                                setStartDate('');
                                setEndDate('');
                                setPage(1);
                            }}
                            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Timestamp</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Entity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {logs.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-zinc-500">
                                                No audit logs found
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                                                    {new Date(log.createdAt).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                                            {log.userName?.charAt(0) || 'U'}
                                                        </div>
                                                        <span className="text-sm text-zinc-900 dark:text-white">{log.userName || 'Unknown'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getActionBadge(log.action)}`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                                                    {log.entityType}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs truncate">
                                                    {log.details ? JSON.stringify(log.details) : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                                <div className="text-sm text-zinc-500">
                                    Page {page} of {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
