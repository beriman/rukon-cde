'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Label } from '@/components/ui/label';

export default function ApprovalsPage() {
    const [selectedSubmittal, setSelectedSubmittal] = useState<any>(null);
    const [comment, setComment] = useState('');
    const [signature, setSignature] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch pending approvals for current user
    // Ideally this endpoint filters by activeApprover = me
    const { data: submittals, isLoading, refetch } = useQuery({
        queryKey: ['my-approvals'],
        queryFn: async () => {
            // For MVP, we might filter client side if backend endpoint doesn't support specific filter yet
            // Assuming GET /submittals returns all project submittals, this is not scalable.
            // Better to have /users/me/approvals or /submittals?approver=me
            // Using a mock endpoint or assuming GET /submittals handles it.
            // Let's assume we use the endpoint we have and filter for now (inefficient but works for prototype)
            // Or better: filter by status 'UNDER_REVIEW' and where I am in activeApprovers
            // But we don't have access to activeApprovers in list view usually unless included.

            // Let's rely on a specific mock or endpoint assumption
            // const response = await apiClient.get('/construction/submittals?status=UNDER_REVIEW'); 
            // Returning mock data for UI Construction since backend might need tweak
            const response = await apiClient.get('/construction/submittals?status=UNDER_REVIEW');
            return response.data || [];
        }
    });

    const handleApprove = async () => {
        setIsSubmitting(true);
        try {
            await apiClient.post(`/construction/submittals/${selectedSubmittal.id}/approve`, {
                userId: 'user-id-placeholder', // In real app, this is handled by session/guard
                comment,
                signature // Sending base64 string
            });
            toast.success('Approved successfully');
            setSelectedSubmittal(null);
            setComment('');
            setSignature(null);
            refetch();
        } catch (error) {
            toast.error('Failed to approve');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Pending Approvals</h1>

            {submittals && submittals.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed">
                    <p className="text-muted-foreground">No items waiting for your approval.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {submittals?.map((item: any) => (
                        <Card key={item.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline">{item.referenceNumber}</Badge>
                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                            Stage {item.currentStageIndex + 1}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg">{item.title}</CardTitle>
                                    <CardDescription>Submitted by {item.submitter?.name || 'Unknown'}</CardDescription>
                                </div>
                                <Button onClick={() => setSelectedSubmittal(item)}>Review</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-6 text-sm text-slate-500 mt-2">
                                    <div className="flex items-center gap-1">
                                        <FileText className="h-4 w-4" />
                                        <span>View Document</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={!!selectedSubmittal} onOpenChange={(open) => !open && setSelectedSubmittal(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Submission</DialogTitle>
                        <DialogDescription>
                            Reviewing {selectedSubmittal?.referenceNumber}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="mb-4 bg-slate-50 p-4 rounded text-sm">
                            Document Link: <a href="#" className="text-blue-600 underline">View File</a> (Mock)
                        </div>
                        <Textarea
                            placeholder="Add comments (optional)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedSubmittal(null)}>Cancel</Button>
                        <Button onClick={handleApprove} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
