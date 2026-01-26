'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Calendar, User, FileText, Download, RotateCcw, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface VersionHistoryDialogProps {
    fileId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface FileVersion {
    version: number;
    uploadedBy: string;
    uploadedAt: string;
    cdeState: string;
    size: number;
    isCurrent: boolean;
}

interface VersionResponse {
    fileId: string;
    fileName: string;
    uniqueId: string;
    versions: FileVersion[];
    currentVersion: number;
}

export function VersionHistoryDialog({ fileId, open, onOpenChange }: VersionHistoryDialogProps) {
    const params = useParams();
    const projectId = params.projectId as string;

    const { data: history, isLoading } = useQuery({
        queryKey: ['file-versions', fileId],
        queryFn: async () => {
            if (!fileId) return null;
            const response = await apiClient.get(`/files/${fileId}/versions`);
            // Helper to find true current version number if backend doesn't explicit it in root
            const data = response.data as VersionResponse;
            // Ensure versions are sorted desc
            data.versions.sort((a, b) => b.version - a.version);
            return data;
        },
        enabled: !!fileId && open,
    });

    const currentVerNum = history?.versions.find(v => v.isCurrent)?.version || history?.currentVersion;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        Version History
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                ) : history ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-lg flex justify-between items-center">
                            <div>
                                <div className="text-sm font-medium text-slate-500">ISO Identifier</div>
                                <div className="font-mono font-bold text-slate-800 text-lg">{history.uniqueId}</div>
                                <div className="text-xs text-slate-400 mt-1">{history.fileName}</div>
                            </div>
                            <div className="text-right">
                                <Badge variant="secondary" className="mb-1">Total Versions: {history.versions.length}</Badge>
                            </div>
                        </div>

                        <ScrollArea className="h-[350px] pr-4">
                            <div className="space-y-4">
                                {history.versions.map((ver) => (
                                    <div key={ver.version} className={`relative pl-6 border-l-2 ${ver.isCurrent ? 'border-blue-500' : 'border-slate-200'} pb-6 last:pb-0`}>
                                        <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 ${ver.isCurrent ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'}`} />

                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold ${ver.isCurrent ? 'text-blue-700' : 'text-slate-700'}`}>
                                                        Version P{String(ver.version).padStart(2, '0')}
                                                    </span>
                                                    {ver.isCurrent && <Badge>Current</Badge>}
                                                    <Badge variant="outline" className="text-xs">{ver.cdeState}</Badge>
                                                </div>
                                                <div className="text-sm text-slate-500 mt-1 flex items-center gap-3">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(ver.uploadedAt).toLocaleString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {ver.uploadedBy || 'Unknown'}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-400 mt-1">
                                                    {(ver.size / 1024 / 1024).toFixed(2)} MB
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {!ver.isCurrent && history.fileName.toLowerCase().endsWith('.pdf') && (
                                                    <Link href={`/projects/${projectId}/compare/pdf/${history.fileId}?versionA=${ver.version}&versionB=${currentVerNum}`}>
                                                        <Button size="sm" variant="outline" className="h-8">
                                                            <GitCompare className="mr-2 h-3 w-3" /> Diff PDF
                                                        </Button>
                                                    </Link>
                                                )}

                                                {!ver.isCurrent && history.fileName.toLowerCase().endsWith('.ifc') && (
                                                    <Link href={`/projects/${projectId}/compare/model/${history.fileId}?versionA=${ver.version}&versionB=${currentVerNum}`}>
                                                        <Button size="sm" variant="outline" className="h-8">
                                                            <GitCompare className="mr-2 h-3 w-3" /> Diff 3D
                                                        </Button>
                                                    </Link>
                                                )}

                                                <Button size="sm" variant="ghost" className="h-8" title="Download">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                ) : (
                    <div className="text-center text-slate-500">No history found</div>
                )}
            </DialogContent>
        </Dialog>
    );
}
