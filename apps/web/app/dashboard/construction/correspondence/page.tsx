'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Mail, MailOpen, Reply } from 'lucide-react';

export default function CorrespondencePage() {
    const [replyTo, setReplyTo] = useState<string | null>(null);

    const inbox = [
        { id: '1', ref: 'SM-001', subject: 'Site Access Restriction', from: 'MK', date: '2025-12-09', status: 'READ' },
        { id: '2', ref: 'SI-012', subject: 'Concrete Testing Requirement', from: 'Owner', date: '2025-12-08', status: 'SENT' },
    ];

    const outbox = [
        { id: '3', ref: 'SM-002', subject: 'Weekly Progress Report', to: 'Owner', date: '2025-12-09', status: 'SENT' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Correspondence Log</h1>
                <Button>New Message</Button>
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
                                            <span className="font-mono text-sm text-gray-500">{item.ref}</span>
                                            <Badge variant={item.status === 'READ' ? 'secondary' : 'default'}>
                                                {item.status}
                                            </Badge>
                                        </div>
                                        <h3 className="font-semibold text-lg">{item.subject}</h3>
                                        <p className="text-sm text-gray-500 mt-1">From: {item.from} • {item.date}</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setReplyTo(item.id)}
                                    >
                                        <Reply className="w-4 h-4 mr-2" />
                                        Reply
                                    </Button>
                                </div>

                                {replyTo === item.id && (
                                    <div className="mt-4 pt-4 border-t">
                                        <Textarea placeholder="Type your reply..." className="mb-2" />
                                        <div className="flex gap-2">
                                            <Button size="sm">Send Reply</Button>
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
                                    <span className="font-mono text-sm text-gray-500">{item.ref}</span>
                                    <Badge variant="secondary">SENT</Badge>
                                </div>
                                <h3 className="font-semibold text-lg">{item.subject}</h3>
                                <p className="text-sm text-gray-500 mt-1">To: {item.to} • {item.date}</p>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
