'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { reviewsService, Submittal } from '@/lib/api/reviews.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, FileText, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function ReviewsPage() {
    const params = useParams();
    const projectId = params.projectId as string;
    const queryClient = useQueryClient();
    const user = useAuthStore((state: any) => state.user);

    // Fetch all submittals for simplicity, then filter on client
    const { data: submittals = [], isLoading } = useQuery({
        queryKey: ['submittals', projectId],
        queryFn: () => reviewsService.getAllSubmittalsByProject(projectId).catch(() => []),
    });

    const processMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: 'APPROVED' | 'REJECTED' }) => 
            reviewsService.processReviewStep(id, status, 'Reviewed via Dashboard'),
        onSuccess: () => {
            toast.success('Review submitted successfully');
            queryClient.invalidateQueries({ queryKey: ['submittals', projectId] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to process review');
        }
    });

    // Determine which ones require MY action
    const pendingMyReview = submittals.filter(s => 
        s.status === 'UNDER_REVIEW' || s.status === 'SUBMITTED' 
        // && s.activeApprovers.includes(user?.id || '') // In a real app, strict filter
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1"/> Approved</Badge>;
            case 'REJECTED': return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1"/> Rejected</Badge>;
            case 'SUBMITTED':
            case 'UNDER_REVIEW': return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50"><Clock className="w-3 h-3 mr-1"/> In Review</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading reviews...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Document Reviews</h1>
                <p className="text-gray-500">Manage CDE workflows and approvals.</p>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-slate-50 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                    <h2 className="font-semibold">Action Required ({pendingMyReview.length})</h2>
                </div>
                
                {pendingMyReview.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                        <CheckCircle className="w-12 h-12 text-green-200 mb-3" />
                        <p>You're all caught up! No documents waiting for your review.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reference</TableHead>
                                <TableHead>Document</TableHead>
                                <TableHead>Submitted By</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingMyReview.map(review => (
                                <TableRow key={review.id}>
                                    <TableCell className="font-medium text-sm">
                                        {review.referenceNumber}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-blue-500" />
                                            <div>
                                                <div className="font-medium">{review.file?.name || review.title}</div>
                                                <div className="text-xs text-gray-500">Ver {review.file?.currentVersion || 1} • {review.file?.cdeState || 'WIP'}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {review.submitter?.name || review.submittedBy}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(review.status)}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                            onClick={() => processMutation.mutate({ id: review.id, status: 'APPROVED' })}
                                            disabled={processMutation.isPending}
                                        >
                                            Approve
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => processMutation.mutate({ id: review.id, status: 'REJECTED' })}
                                            disabled={processMutation.isPending}
                                        >
                                            Reject
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="font-semibold">Review History</h2>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reference</TableHead>
                            <TableHead>Document</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submittals.filter(s => s.status === 'APPROVED' || s.status === 'REJECTED').map(review => (
                            <TableRow key={review.id}>
                                <TableCell className="font-medium text-sm">{review.referenceNumber}</TableCell>
                                <TableCell>{review.file?.name || review.title}</TableCell>
                                <TableCell>{getStatusBadge(review.status)}</TableCell>
                                <TableCell className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
