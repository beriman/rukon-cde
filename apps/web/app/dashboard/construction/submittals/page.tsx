'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

type SubmittalStatus =
    | 'DRAFT'
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'APPROVED'
    | 'APPROVED_WITH_NOTES'
    | 'REJECTED'
    | 'RESUBMITTED';

interface Submittal {
    id: string;
    referenceNumber: string;
    title: string;
    type: string;
    status: SubmittalStatus;
    createdAt: string;
}

const statusColors: Record<SubmittalStatus, string> = {
    DRAFT: 'bg-gray-200 text-gray-800',
    SUBMITTED: 'bg-blue-200 text-blue-800',
    UNDER_REVIEW: 'bg-yellow-200 text-yellow-800',
    APPROVED: 'bg-green-200 text-green-800',
    APPROVED_WITH_NOTES: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-200 text-red-800',
    RESUBMITTED: 'bg-purple-200 text-purple-800',
};

export default function SubmittalsPage() {
    const [showForm, setShowForm] = useState(false);

    // Mock data
    const submittals: Submittal[] = [
        {
            id: '1',
            referenceNumber: 'SD-001',
            title: 'Foundation Detail Drawing',
            type: 'SHOP_DRAWING',
            status: 'UNDER_REVIEW',
            createdAt: '2025-12-09',
        },
        {
            id: '2',
            referenceNumber: 'MS-001',
            title: 'Concrete Pouring Method',
            type: 'METHOD_STATEMENT',
            status: 'APPROVED',
            createdAt: '2025-12-08',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Shop Drawings & Method Statements</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Submittal
                </Button>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Submittal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500">Form akan ditambahkan di sini</p>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {submittals.map((submittal) => (
                    <Card key={submittal.id}>
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-mono text-gray-500">{submittal.referenceNumber}</span>
                                        <Badge className={statusColors[submittal.status]}>
                                            {submittal.status.replace(/_/g, ' ')}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-semibold">{submittal.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {submittal.type.replace(/_/g, ' ')} • Created {submittal.createdAt}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    View Details
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
