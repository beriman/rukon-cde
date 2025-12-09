'use client';

import React from 'react';
import { FederationViewer } from '@/components/design/FederationViewer';

export default function FederationPage() {
    return (
        <div className="container mx-auto py-6 px-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Model Federation</h1>
                <p className="text-gray-500">Coordination Room: Merge, Overlay, and Check for Clashes.</p>
            </div>

            <FederationViewer />
        </div>
    );
}
