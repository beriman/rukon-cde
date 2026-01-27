'use client';

import { HseDashboard } from '@/components/features/hse/HseDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HsePage({ params }: { params: { projectId: string } }) {
    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/projects/${params.projectId}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">HSE Management System</h1>
            </div>

            <HseDashboard projectId={params.projectId} />
        </div>
    );
}
