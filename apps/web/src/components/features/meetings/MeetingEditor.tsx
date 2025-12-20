/**
 * Meeting Editor Component
 * Story 7.7: Meeting Management
 */
import React, { useState, useEffect } from 'react';

interface ActionItem {
    id: string;
    title: string;
    description?: string;
    assignee: { id: string; name: string };
    dueDate: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
    bcfTopicId?: string;
}

interface Meeting {
    id: string;
    title: string;
    date: string;
    location?: string;
    attendees: string[];
    agenda?: string;
    status: string;
    actionItems: ActionItem[];
}

interface MeetingEditorProps {
    meetingId?: string;
    projectId: string;
    apiBaseUrl: string;
    authToken: string;
    onSave?: (meeting: Meeting) => void;
    onClose?: () => void;
}

const priorityColors = {
    LOW: 'bg-gray-100 text-gray-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HIGH: 'bg-red-100 text-red-700',
};

const statusColors = {
    OPEN: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-orange-100 text-orange-700',
    CLOSED: 'bg-green-100 text-green-700',
};

export const MeetingEditor: React.FC<MeetingEditorProps> = ({
    meetingId,
    projectId,
    apiBaseUrl,
    authToken,
    onSave,
    onClose,
}) => {
    const [meeting, setMeeting] = useState<Partial<Meeting>>({
        title: '',
        date: new Date().toISOString().split('T')[0],
        attendees: [],
        actionItems: [],
    });
    const [loading, setLoading] = useState(false);
    const [newAction, setNewAction] = useState({
        title: '',
        assigneeId: '',
        dueDate: '',
        priority: 'MEDIUM' as const,
    });

    useEffect(() => {
        if (meetingId) {
            fetchMeeting();
        }
    }, [meetingId]);

    const fetchMeeting = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBaseUrl}/meetings/${meetingId}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            const data = await res.json();
            setMeeting(data);
        } catch (err) {
            console.error('Failed to fetch meeting');
        } finally {
            setLoading(false);
        }
    };

    const saveMeeting = async () => {
        const method = meetingId ? 'PUT' : 'POST';
        const url = meetingId
            ? `${apiBaseUrl}/meetings/${meetingId}`
            : `${apiBaseUrl}/meetings`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    projectId,
                    title: meeting.title,
                    date: meeting.date,
                    location: meeting.location,
                    attendees: meeting.attendees,
                    agenda: meeting.agenda,
                }),
            });
            const saved = await res.json();
            onSave?.(saved);
        } catch (err) {
            console.error('Failed to save meeting');
        }
    };

    const addActionItem = async () => {
        if (!meetingId || !newAction.title) return;

        try {
            const res = await fetch(`${apiBaseUrl}/meetings/${meetingId}/actions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(newAction),
            });
            const action = await res.json();
            setMeeting(prev => ({
                ...prev,
                actionItems: [...(prev.actionItems || []), action],
            }));
            setNewAction({ title: '', assigneeId: '', dueDate: '', priority: 'MEDIUM' });
        } catch (err) {
            console.error('Failed to add action');
        }
    };

    const updateActionStatus = async (actionId: string, status: ActionItem['status']) => {
        try {
            await fetch(`${apiBaseUrl}/meetings/actions/${actionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ status }),
            });
            setMeeting(prev => ({
                ...prev,
                actionItems: prev.actionItems?.map(a =>
                    a.id === actionId ? { ...a, status } : a
                ),
            }));
        } catch (err) {
            console.error('Failed to update action');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                    {meetingId ? 'Edit Meeting' : 'New Meeting'}
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Meeting Details */}
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={meeting.title}
                            onChange={e => setMeeting(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Meeting title"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            value={meeting.date?.split('T')[0]}
                            onChange={e => setMeeting(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agenda</label>
                    <textarea
                        value={meeting.agenda || ''}
                        onChange={e => setMeeting(prev => ({ ...prev, agenda: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Meeting agenda..."
                    />
                </div>

                {/* Action Items */}
                {meetingId && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Action Items</h3>

                        <div className="space-y-2 mb-4">
                            {meeting.actionItems?.map(action => (
                                <div key={action.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <select
                                        value={action.status}
                                        onChange={e => updateActionStatus(action.id, e.target.value as ActionItem['status'])}
                                        className={`px-2 py-1 rounded text-xs font-medium ${statusColors[action.status]}`}
                                    >
                                        <option value="OPEN">Open</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="CLOSED">Closed</option>
                                    </select>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{action.title}</p>
                                        <p className="text-sm text-gray-500">
                                            {action.assignee.name} • Due: {new Date(action.dueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${priorityColors[action.priority]}`}>
                                        {action.priority}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Add New Action */}
                        <div className="flex gap-2 p-3 bg-gray-100 rounded-lg">
                            <input
                                type="text"
                                value={newAction.title}
                                onChange={e => setNewAction(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="New action item..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            <button
                                onClick={addActionItem}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    onClick={saveMeeting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Save Meeting
                </button>
            </div>
        </div>
    );
};

export default MeetingEditor;
