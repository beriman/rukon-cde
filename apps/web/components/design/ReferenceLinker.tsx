'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, File, Folder } from 'lucide-react';

interface FileItem {
    id: string;
    name: string;
    folder: string;
}

export function ReferenceLinker({ onLink }: { onLink: (fileId: string) => void }) {
    // Mock "Shared" folder content
    const sharedFiles: FileItem[] = [
        { id: 'f1', name: 'Struct_Grid_v3.ifc', folder: 'SHARED_STRUCT' },
        { id: 'f2', name: 'MEP_Ductwork_Lvl1.ifc', folder: 'SHARED_MEP' },
        { id: 'f3', name: 'Landscape_Site.dwg', folder: 'SHARED_ARCH' },
    ];

    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const handleLink = () => {
        if (selectedFile) {
            onLink(selectedFile);
            setSelectedFile(null);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5" /> Link Reference
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="text-sm text-gray-500">
                        Select a file from the <strong>SHARED</strong> area to link into your WIP workspace.
                    </div>

                    <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
                        {sharedFiles.map(file => (
                            <div
                                key={file.id}
                                className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedFile === file.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                                onClick={() => setSelectedFile(file.id)}
                            >
                                <File className="h-4 w-4 text-gray-400" />
                                <div className="flex-1">
                                    <div className="text-sm font-medium">{file.name}</div>
                                    <div className="text-xs text-gray-400">{file.folder}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button className="w-full" disabled={!selectedFile} onClick={handleLink}>
                        Create Reference Link
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
