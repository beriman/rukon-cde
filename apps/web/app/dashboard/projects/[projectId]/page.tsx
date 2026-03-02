'use client';

import React from 'react';
import ProjectDashboard from './details';
import { useParams } from 'next/navigation';

export default function ProjectPage() {
    const params = useParams();
    const projectId = params.projectId as string;

    if (!projectId) return null;

    return <ProjectDashboard projectId={projectId} />;
}
