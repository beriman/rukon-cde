'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock Tenders
const tenders = [
    { id: '1', title: 'Pylos Office Complex - MEP Package', status: 'OPEN', bidders: 3, deadline: '2025-03-01' },
    { id: '2', title: 'Terminal 5 Expansion - Concrete', status: 'DRAFT', bidders: 0, deadline: '2025-04-15' },
];

// Mock Files for Data Room
const files = [
    { id: 'f1', name: 'EIR_v1.0.pdf', size: '2.4 MB', access: 'View Only' },
    { id: 'f2', name: 'Reference_Drawings.zip', size: '450 MB', access: 'Download' },
];

export function TenderDashboard() {
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [activeTender, setActiveTender] = useState<any>(null);

    const openTender = (t: any) => {
        setActiveTender(t);
        setView('detail');
    };

    const [showLogs, setShowLogs] = useState(false);

    // Mock Logs
    const accessLogs = [
        { id: 1, user: 'estimator@buildgrp.com', action: 'VIEW', file: 'EIR_v1.0.pdf', timestamp: '2025-02-15 10:30 AM' },
        { id: 2, user: 'estimator@buildgrp.com', action: 'DOWNLOAD', file: 'Reference_Drawings.zip', timestamp: '2025-02-15 10:35 AM' },
        { id: 3, user: 'bidding@constuct-inc.com', action: 'VIEW', file: 'EIR_v1.0.pdf', timestamp: '2025-02-16 09:15 AM' },
    ];

    return (
        <div className="space-y-6">
            {view === 'list' ? (
                <Card>
                    <CardHeader><CardTitle>Active Tenders</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {tenders.map(t => (
                                <div key={t.id} className="flex justify-between items-center p-4 border rounded hover:bg-slate-50 cursor-pointer" onClick={() => openTender(t)}>
                                    <div>
                                        <h3 className="font-semibold">{t.title}</h3>
                                        <p className="text-sm text-gray-500">Deadline: {t.deadline}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{t.status}</span>
                                        <span className="text-sm text-gray-600">{t.bidders} Bidders</span>
                                    </div>
                                </div>
                            ))}
                            <Button>+ Create New Tender</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <Button variant="outline" onClick={() => setView('list')}>&larr; Back to Tenders</Button>
                        <h2 className="text-xl font-bold">{activeTender.title}</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {/* Left: Data Room */}
                        <Card className="col-span-2">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Secure Data Room</CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => setShowLogs(!showLogs)}>
                                    {showLogs ? 'View Files' : 'View Access Logs'}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {showLogs ? (
                                    <div className="border rounded">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="p-2">User</th>
                                                    <th className="p-2">Action</th>
                                                    <th className="p-2">File</th>
                                                    <th className="p-2">Timestamp</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {accessLogs.map(log => (
                                                    <tr key={log.id}>
                                                        <td className="p-2">{log.user}</td>
                                                        <td className="p-2 font-mono text-xs">{log.action}</td>
                                                        <td className="p-2">{log.file}</td>
                                                        <td className="p-2 text-gray-500">{log.timestamp}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <>
                                        <div className="border rounded divide-y">
                                            {files.map(f => (
                                                <div key={f.id} className="p-3 flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-blue-500">📄</span>
                                                        <span>{f.name}</span>
                                                        <span className="text-xs text-gray-400">({f.size})</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm">{f.access}</Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4">
                                            <Button variant="outline" size="sm">Upload Document</Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Right: Bidders & Q&A */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle>Invited Bidders</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-2 mb-4">
                                        <div className="text-sm">bidding@constuct-inc.com <span className="text-green-500 text-xs">(Accepted)</span></div>
                                        <div className="text-sm">estimator@buildgrp.com <span className="text-yellow-500 text-xs">(Pending)</span></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input placeholder="Email address" className="h-8" />
                                        <Button size="sm">Invite</Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Q&A Threads</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-sm text-gray-500 text-center py-4">No questions asked yet.</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
