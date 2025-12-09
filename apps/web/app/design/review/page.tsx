'use client';

import { DesignViewer } from '@/components/design/DesignViewer';

export default function DesignReviewPage() {
    return (
        <div className="container mx-auto py-6 px-4 h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Design Review: A-101-FloorPlan.pdf</h1>
                    <p className="text-sm text-gray-500">Version 2.0 • Shared by Architect</p>
                </div>
            </div>

            <div className="flex-1 border rounded-lg shadow-sm overflow-hidden">
                <DesignViewer />
            </div>
        </div>
    );
}
