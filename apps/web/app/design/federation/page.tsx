'use client';

import { ThreeDViewer } from '@/components/design/ThreeDViewer';

export default function FederationPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-2">3D Coordination</h1>
            <p className="text-gray-500 mb-6">Federate multiple IFC models to detect clashes and verify coordination.</p>
            <ThreeDViewer />
        </div>
    );
}
