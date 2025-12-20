/**
 * My Action Items Widget
 * Story 7.7: Meeting Management
 */
import React, { useState, useEffect } from 'react';

interface ActionItem {
    id: string;
    title: string;
    dueDate: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
    meeting: { id: string; title: string; date: string };
}

interface MyActionItemsWidgetProps {
    projectId?: string;
    apiBaseUrl: string;
    authToken: string;
}

export const MyActionItemsWidget: React.FC<MyActionItemsWidgetProps> = ({
    projectId,
    apiBaseUrl,
    authToken,
}) => {
    const [items, setItems] = useState<ActionItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, [projectId]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const url = projectId
                ? `${apiBaseUrl}/meetings/my-actions?projectId=${projectId}`
                : `${apiBaseUrl}/meetings/my-actions`;
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error('Failed to fetch actions');
        } finally {
            setLoading(false);
        }
    };

    const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow p-6">
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow">
            <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span>📋</span> My Action Items
                    {items.length > 0 && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                            {items.length}
                        </span>
                    )}
                </h3>
            </div>

            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                        <span className="text-3xl">✅</span>
                        <p className="mt-2">No open action items</p>
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="px-4 py-3 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.title}</p>
                                    <p className="text-sm text-gray-500">
                                        From: {item.meeting.title}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-sm ${isOverdue(item.dueDate) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                        {isOverdue(item.dueDate) ? '⚠️ Overdue' : new Date(item.dueDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyActionItemsWidget;
