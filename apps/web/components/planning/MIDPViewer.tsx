'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function MIDPViewer() {
    const [deliverables, setDeliverables] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // Fetch from API
        fetch('http://localhost:3001/planning/midp/proj-1')
            .then(res => res.json())
            .then(data => {
                setDeliverables(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Simple stats
    const total = deliverables.length;
    const planned = deliverables.filter((d: any) => d.status === 'PLANNED').length;
    const inProgress = deliverables.filter((d: any) => d.status === 'IN_PROGRESS').length;
    const completed = deliverables.filter((d: any) => d.status === 'COMPLETED').length;

    if (loading) return <div>Loading MIDP...</div>;

    return (
        <div className="space-y-6">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Deliverables</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{total}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Planned</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{planned}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">In Progress</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-blue-600">{inProgress}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Completed</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">{completed}</div></CardContent>
                </Card>
            </div>

            {/* Master List */}
            <Card>
                <CardHeader>
                    <CardTitle>Master Information Delivery Plan (MIDP)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>TIDP Source</TableHead>
                                <TableHead>Originator</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Number</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Delivery Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deliverables.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.tidp}</TableCell>
                                    <TableCell>{row.originator}</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>{row.number}</TableCell>
                                    <TableCell>{row.title}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={row.status === 'IN_PROGRESS' ? 'default' : 'outline'}>
                                            {row.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
