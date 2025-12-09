'use client';

import { WorkspaceDashboard } from '@/components/design/WorkspaceDashboard';

export default function WorkspacesPage() {
    // Hardcoded project ID for demo
    const projectId = "proj-123";

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-2">Design Collaboration</h1>
            <p className="text-gray-500 mb-8">Manage WIP folders and cross-discipline coordination.</p>

            <WorkspaceDashboard projectId={projectId} />
        </div>
    );
}
