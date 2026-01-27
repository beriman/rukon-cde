'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, FileText, CheckCircle, XCircle, Download, ExternalLink } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface Correspondence {
    id: string;
    referenceNumber: string;
    status: string;
    subject: string;
    message: string;
    from: string;
    to: string[];
    createdAt: string;
    updatedAt: string;
    pdfUrl?: string;
    category?: string;
    attachments: string[];
}

export default function CorrespondenceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [correspondence, setCorrespondence] = useState<Correspondence | null>(null);
    const [approving, setApproving] = useState(false);

    useEffect(() => {
        if (id) {
            fetchDetail();
        }
    }, [id]);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/construction/correspondence/${id}`);
            setCorrespondence(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load correspondence');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!confirm('Are you sure you want to approve this correspondence? It will be officially signed and sent.')) return;

        try {
            setApproving(true);
            await apiClient.patch(`/construction/correspondence/${id}/approve`);
            toast.success('Correspondence approved and signed successfully');
            fetchDetail(); // Refresh to see updated status/PDF
        } catch (error) {
            console.error(error);
            toast.error('Failed to approve correspondence');
        } finally {
            setApproving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (!correspondence) {
        return <div className="text-center p-8">Correspondence not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
                        {correspondence.subject}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <span className="font-mono">{correspondence.referenceNumber}</span>
                        <span>•</span>
                        <span>{new Date(correspondence.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <Badge variant={
                        correspondence.status === 'APPROVED' || correspondence.status === 'SENT' ? 'default' :
                            correspondence.status === 'PENDING_APPROVAL' ? 'outline' : 'secondary'
                    } className={correspondence.status === 'PENDING_APPROVAL' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 text-sm px-3 py-1' : 'text-sm px-3 py-1'}>
                        {correspondence.status}
                    </Badge>

                    {correspondence.status === 'PENDING_APPROVAL' && (
                        <Button onClick={handleApprove} disabled={approving} className="bg-green-600 hover:bg-green-700">
                            {approving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                            Approve & Sign
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Message Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-500 block mb-1">From</span>
                                    <span className="font-medium text-slate-800">{correspondence.from}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block mb-1">To</span>
                                    <div className="flex flex-wrap gap-1">
                                        {correspondence.to.map((recipient, i) => (
                                            <Badge key={i} variant="outline">{recipient}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="h-px bg-slate-200 my-4" />
                            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                                {correspondence.message}
                            </div>
                        </CardContent>
                    </Card>

                    {/* PDF Preview */}
                    {correspondence.pdfUrl && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-red-500" />
                                    Official Letter PDF
                                </CardTitle>
                                <Button variant="outline" size="sm" asChild>
                                    <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/files/${correspondence.pdfUrl}`} target="_blank" rel="noopener noreferrer">
                                        <Download className="w-4 h-4 mr-2" /> Download
                                    </a>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-[1/1.4] w-full bg-slate-100 border rounded-lg overflow-hidden flex items-center justify-center relative group">
                                    <iframe
                                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/files/${correspondence.pdfUrl}#toolbar=0`}
                                        className="w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                                        <Button variant="secondary" asChild>
                                            <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/files/${correspondence.pdfUrl}`} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-4 h-4 mr-2" /> Open in New Tab
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Attachments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Attachments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {correspondence.attachments.length > 0 ? (
                                <ul className="space-y-2">
                                    {correspondence.attachments.map((att, i) => (
                                        <li key={i} className="text-sm p-2 bg-slate-50 border rounded flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                            <span className="truncate flex-1">{att.split('/').pop()}</span>
                                            <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/files/${att}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary">
                                                <Download className="w-4 h-4" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-400 italic">No attachments</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Timeline / Metadata? */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <span className="text-slate-500 block">Category</span>
                                <Badge variant="outline">{correspondence.category || 'General'}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
