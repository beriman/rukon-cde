'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { FileText, Download, Eye, MoreHorizontal, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { VersionHistoryDialog } from './VersionHistoryDialog';
import { SubmitDialog } from './SubmitDialog';

interface File {
    id: string;
    name: string;
    uniqueId: string;
    size: number;
    mimeType: string;
    currentVersion: number;
    cdeState: string;
    createdAt: string;
}

interface FileExplorerProps {
    folderId: string;
}

export function FileExplorer({ folderId }: FileExplorerProps) {
    const [historyFileId, setHistoryFileId] = useState<string | null>(null);
    const [submitFileId, setSubmitFileId] = useState<string | null>(null);
    const params = useParams();
    const projectId = params.projectId as string;

    const { data: files, isLoading, refetch } = useQuery({
        queryKey: ['files', folderId],
        queryFn: async () => {
            if (!folderId) return [];
            const response = await apiClient.get(`/files/folder/${folderId}`);
            return response.data as File[];
        },
        enabled: !!folderId,
    });

    const columns: ColumnDef<File>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => {
                const file = row.original;
                const isIfc = file.name.toLowerCase().endsWith('.ifc');
                return (
                    <div className="flex items-center gap-2">
                        <FileText className={`h-4 w-4 ${isIfc ? 'text-green-500' : 'text-blue-500'}`} />
                        <span className="font-medium truncate max-w-[300px]" title={file.name}>
                            {file.name}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'uniqueId',
            header: 'ISO ID',
            cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('uniqueId')}</span>,
        },
        {
            accessorKey: 'currentVersion',
            header: 'Rev',
            cell: ({ row }) => <Badge variant="outline">P{String(row.getValue('currentVersion')).padStart(2, '0')}</Badge>,
        },
        {
            accessorKey: 'cdeState',
            header: 'State',
            cell: ({ row }) => {
                const state = row.getValue('cdeState') as string;
                return (
                    <Badge className={
                        state === 'WIP' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                            state === 'SHARED' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                'bg-slate-100 text-slate-800'
                    }>
                        {state}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'size',
            header: 'Size',
            cell: ({ row }) => {
                const size = row.getValue('size') as number;
                return <span className="text-slate-500 text-xs">{(size / 1024 / 1024).toFixed(2)} MB</span>;
            },
        },
        {
            accessorKey: 'updatedAt',
            header: 'Date',
            cell: ({ row }) => {
                return <span className="text-slate-500 text-xs">{new Date(row.original.createdAt).toLocaleDateString()}</span>
            }
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const file = row.original;
                const isIfc = file.name.toLowerCase().endsWith('.ifc');

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(file.uniqueId)}
                            >
                                Copy ISO ID
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setHistoryFileId(file.id)}>
                                <RotateCcw className="mr-2 h-4 w-4" /> Version History
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild disabled={!isIfc}>
                                {isIfc ? (
                                    <Link href={`/projects/${projectId}/models/${file.id}`} className="flex items-center cursor-pointer">
                                        <Eye className="mr-2 h-4 w-4" /> View Model
                                    </Link>
                                ) : (
                                    <div className="flex items-center text-muted-foreground">
                                        <Eye className="mr-2 h-4 w-4" /> View Model (IFC only)
                                    </div>
                                )}
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href={`#`} className="flex items-center">
                                    <Download className="mr-2 h-4 w-4" /> Download
                                </Link>
                            </DropdownMenuItem>

                            {file.cdeState === 'WIP' && (
                                <DropdownMenuItem onClick={() => setSubmitFileId(file.id)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Submit for Approval
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-10 bg-slate-100 rounded animate-pulse" />
                <div className="h-10 bg-slate-100 rounded animate-pulse" />
                <div className="h-10 bg-slate-100 rounded animate-pulse" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {files && files.length > 0 ? (
                <DataTable columns={columns} data={files} />
            ) : (
                <div className="text-center py-10 border border-dashed rounded-lg text-slate-500">
                    <p>No files in this folder.</p>
                </div>
            )}

            <VersionHistoryDialog
                fileId={historyFileId}
                open={!!historyFileId}
                onOpenChange={(open) => !open && setHistoryFileId(null)}
            />

            <SubmitDialog
                open={!!submitFileId}
                onOpenChange={(open) => !open && setSubmitFileId(null)}
                fileId={submitFileId || ''}
                projectId={projectId}
                onSuccess={() => refetch()}
            />
        </div>
    );
}

