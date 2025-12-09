'use client';

import React, { useState } from 'react';
import { ReferenceLinker } from '@/components/design/ReferenceLinker';
import { Card, CardContent } from '@/components/ui/card';
import { FileSymlink } from 'lucide-react';

export default function ReferencesPage() {
    const [linkedFiles, setLinkedFiles] = useState<string[]>([]);

    const handleLink = (fileId: string) => {
        // Mock API call
        console.log(`Linking file ${fileId}...`);
        setLinkedFiles([...linkedFiles, fileId]);
        alert(`File ${fileId} successfully linked as XREF!`);
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-2">Reference Management</h1>
            <p className="text-gray-500 mb-8">Manage XREFs and coordinated models.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Linker Tool */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Add Reference</h2>
                    <ReferenceLinker onLink={handleLink} />
                </div>

                {/* Right: Active Links */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Active References</h2>
                    <div className="space-y-4">
                        {linkedFiles.length === 0 ? (
                            <div className="text-gray-400 italic">No references linked yet.</div>
                        ) : (
                            linkedFiles.map((id, idx) => (
                                <Card key={idx}>
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <FileSymlink className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <div className="font-medium">Linked File ({id})</div>
                                            <div className="text-xs text-gray-500">Status: Loaded • Version: Latest</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
