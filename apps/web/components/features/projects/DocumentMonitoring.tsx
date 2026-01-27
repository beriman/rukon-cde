'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

export function DocumentMonitoring({ projectId }: { projectId: string }) {
    const { data: monitoring, isLoading } = useQuery({
        queryKey: ['project-monitoring', projectId],
        queryFn: async () => {
            const res = await apiClient.get(`/projects/${projectId}/monitoring`);
            return res.data;
        }
    });

    if (isLoading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div>;
    if (!monitoring) return <div>No data available</div>;

    const categories = [
        { key: 'SHOP_DRAWING', label: 'Shop Drawings' },
        { key: 'WORK_REQUEST', label: 'Work Requests' },
        { key: 'RFI', label: 'RFI' },
        { key: 'MATERIAL_APPROVAL', label: 'Material Approvals' },
        { key: 'MODEL_LOD400', label: 'LOD 400' },
        { key: 'MODEL_LOD500', label: 'LOD 500' },
        { key: 'AS_BUILT_DRAWING', label: 'As-Built' }
    ];

    const getStatusColor = (status: string) => {
        if (status.includes('APPROVED')) return 'bg-green-100 text-green-800';
        if (status === 'REJECTED') return 'bg-red-100 text-red-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight">Document Monitoring</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(0, 4).map(cat => {
                    const data = monitoring[cat.key] || { total: 0 };
                    return (
                        <Card key={cat.key}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{cat.label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.total}</div>
                                <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                                    <span className="text-green-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1" />{data.approved}</span>
                                    <span className="text-red-600 flex items-center"><XCircle className="w-3 h-3 mr-1" />{data.rejected}</span>
                                    <span className="text-yellow-600 flex items-center"><Clock className="w-3 h-3 mr-1" />{data.pending}</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Detailed Tabs */}
            <Card>
                <CardContent className="pt-6">
                    <Tabs defaultValue="SHOP_DRAWING">
                        <TabsList className="mb-4 flex flex-wrap h-auto">
                            {categories.map(cat => (
                                <TabsTrigger key={cat.key} value={cat.key}>{cat.label}</TabsTrigger>
                            ))}
                        </TabsList>

                        {categories.map(cat => {
                            const data = monitoring[cat.key] || { items: [] };
                            return (
                                <TabsContent key={cat.key} value={cat.key}>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Title / File</TableHead>
                                                    <TableHead>Initiator</TableHead>
                                                    <TableHead>Stage</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.items.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                            No documents in this category
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    data.items.map((item: any) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell>
                                                                <div className="font-medium">{item.title}</div>
                                                                <div className="text-xs text-muted-foreground flex items-center">
                                                                    <FileText className="w-3 h-3 mr-1" />
                                                                    {item.fileName || 'No file'}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{item.submitter}</TableCell>
                                                            <TableCell>{item.currentStage}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className={getStatusColor(item.status)}>
                                                                    {item.status.replace('_', ' ')}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
