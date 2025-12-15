'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface PermitToWork {
    id: string;
    type: string;
    location: string;
    validFrom: string;
    validTo: string;
    status: string;
    requestedBy: string;
}

export default function PTWListPage({ params }: { params: { projectId: string } }) {
    const [permits, setPermits] = useState<PermitToWork[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/projects/${params.projectId}/permits`)
            .then(res => res.json())
            .then(data => {
                setPermits(data);
                setLoading(false);
            });
    }, [params.projectId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-500';
            case 'PENDING': return 'bg-yellow-500';
            case 'REJECTED': return 'bg-red-500';
            case 'EXPIRED': return 'bg-gray-500';
            default: return 'bg-blue-500';
        }
    };

    if (loading) return <div>Loading permits...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Permit to Work (PTW)</h1>
                <Link href={`/dashboard/projects/${params.projectId}/hse/ptw/request`}>
                    <Button>Request New PTW</Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {permits.map(permit => (
                    <Card key={permit.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{permit.type}</CardTitle>
                                    <p className="text-sm text-gray-500">{permit.location}</p>
                                </div>
                                <Badge className={getStatusColor(permit.status)}>
                                    {permit.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Valid From</p>
                                    <p className="font-medium">{new Date(permit.validFrom).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Valid To</p>
                                    <p className="font-medium">{new Date(permit.validTo).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Requested By</p>
                                    <p className="font-medium">{permit.requestedBy}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link href={`/dashboard/projects/${params.projectId}/hse/ptw/${permit.id}`}>
                                    <Button variant="outline" size="sm">View Details</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {permits.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <p className="text-gray-500">No permits found</p>
                            <Link href={`/dashboard/projects/${params.projectId}/hse/ptw/request`}>
                                <Button className="mt-4">Request First PTW</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
