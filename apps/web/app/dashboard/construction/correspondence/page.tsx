'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Mail, MailOpen, Reply, Loader2, FileText } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

interface Correspondence {
    id: string;
    referenceNumber: string;
    subject: string;
    from: string;
    to?: string[];
    status: string;
    createdAt: string;
    category?: string;
    pdfUrl?: string;
}

export default function CorrespondencePage({ params }: { params: { projectId: string } }) {
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [inbox, setInbox] = useState<Correspondence[]>([]);
    const [outbox, setOutbox] = useState<Correspondence[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');

    const projectId = params.projectId || 'demo-project-1';

    useEffect(() => {
        const fetchCorrespondence = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get<Correspondence[]>(`/construction/correspondence/project/${projectId}`);

                if (response.data) {
                    const data = response.data;
                    // Separate into inbox and outbox based on type or metadata
                    // Assuming 'from' matches current user name or id roughly, or status SENT logic
                    // Ideally backend separates or provides separate endpoints.
                    // For now, simple filter logic based on status and assumption
                    setInbox(data.filter((c) => c.status !== 'SENT')); // Simplified
                    setOutbox(data.filter((c) => c.status === 'SENT'));
                }
            } catch (err) {
                console.error('Error fetching correspondence:', err);
                // Demo data fallback skipped for brevity, or keep if needed
            } finally {
                setLoading(false);
            }
        };

        fetchCorrespondence();
    }, [projectId]);

    const handleReply = async (id: string) => {
        try {
            const response = await fetch(`/api/construction/correspondence/${id}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    from: 'current-user-id',
                    message: replyText,
                }),
            });

            if (response.ok) {
                setReplyTo(null);
                setReplyText('');
                // Update status
                setInbox(inbox.map(item =>
                    item.id === id ? { ...item, status: 'REPLIED' } : item
                ));
            }
        } catch (err) {
            console.error('Error sending reply:', err);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await fetch(`/api/construction/correspondence/${id}/read`, {
                method: 'PATCH',
            });

            setInbox(inbox.map(item =>
                item.id === id ? { ...item, status: 'READ' } : item
            ));
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Correspondence Log</h1>
                <Link href={`/dashboard/construction/correspondence/new`}>
                    <Button>New Message</Button>
                </Link>
            </div>

            <Tabs defaultValue="inbox">
                <TabsList>
                    <TabsTrigger value="inbox">
                        <Mail className="w-4 h-4 mr-2" />
                        Inbox ({inbox.length})
                    </TabsTrigger>
                    <TabsTrigger value="outbox">
                        <MailOpen className="w-4 h-4 mr-2" />
                        Outbox ({outbox.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="inbox" className="space-y-3">
                    {inbox.map(item => (
                        <Card key={item.id} className={item.status === 'SENT' ? 'border-l-4 border-blue-500' : ''}>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-mono text-sm text-gray-500">{item.referenceNumber}</span>
                                            <Badge variant={
                                                item.status === 'READ' ? 'secondary' :
                                                    item.status === 'PENDING_APPROVAL' ? 'outline' : 'default'
                                            } className={item.status === 'PENDING_APPROVAL' ? 'border-yellow-500 text-yellow-700 bg-yellow-50' : ''}>
                                                {item.status}
                                            </Badge>
                                            {item.category === 'OFFICIAL_LETTER' && (
                                                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">Official</Badge>
                                            )}
                                        </div>
                                        <Link href={`/dashboard/construction/correspondence/${item.id}`} className="hover:underline block w-fit">
                                            <h3 className="font-semibold text-lg">{item.subject}</h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-1">From: {item.from} • {item.createdAt}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {item.pdfUrl && (
                                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-200" onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/files/download?key=${item.pdfUrl}`, '_blank')}>
                                                <FileText className="w-4 h-4 mr-2" />
                                                View PDF
                                            </Button>
                                        )}
                                        {item.status === 'SENT' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleMarkAsRead(item.id)}
                                            >
                                                Mark Read
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setReplyTo(item.id)}
                                        >
                                            <Reply className="w-4 h-4 mr-2" />
                                            Reply
                                        </Button>
                                    </div>
                                </div>

                                {replyTo === item.id && (
                                    <div className="mt-4 pt-4 border-t">
                                        <Textarea
                                            placeholder="Type your reply..."
                                            className="mb-2"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleReply(item.id)}>Send Reply</Button>
                                            <Button size="sm" variant="outline" onClick={() => setReplyTo(null)}>Cancel</Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="outbox" className="space-y-3">
                    {outbox.map(item => (
                        <Card key={item.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-mono text-sm text-gray-500">{item.referenceNumber}</span>
                                    <Badge variant="secondary">SENT</Badge>
                                </div>
                                <Link href={`/dashboard/construction/correspondence/${item.id}`} className="hover:underline block w-fit">
                                    <h3 className="font-semibold text-lg">{item.subject}</h3>
                                </Link>
                                <p className="text-sm text-gray-500 mt-1">
                                    To: {item.to?.join(', ') || 'Recipients'} • {item.createdAt}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs >
        </div >
    );
}
