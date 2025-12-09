'use client';

import { ReferenceLinker } from '@/components/design/ReferenceLinker';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

export default function ReferencesPage() {
    const handleLink = (fileId: string) => {
        alert(`Linked file ${fileId} successfully! (Mock API Call)`);
        // Real: POST /api/files/link
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Reference Management (XREFs)</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ReferenceLinker onLink={handleLink} />

                <Card>
                    <CardHeader>
                        <CardTitle>Current References</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-gray-500">
                            No active references in your current workspace.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
