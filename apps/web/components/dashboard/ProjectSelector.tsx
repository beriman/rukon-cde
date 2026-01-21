'use client';

import { useProjectStore } from '@/stores/useProjectStore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function ProjectSelector() {
    const { projects, activeProject, fetchProjects, setActiveProject } = useProjectStore();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="mb-2 px-3 relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors group"
            >
                <span className="truncate max-w-[160px]">
                    {activeProject ? activeProject.name : 'Select Project'}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown / Accordion */}
            {isOpen && (
                <div className="mt-2 space-y-1 bg-white/50 rounded-lg p-1 border border-white/60 animate-in fade-in slide-in-from-top-1 duration-200">
                    {projects.length === 0 ? (
                        <div className="px-2 py-1 text-xs text-slate-400">No projects found</div>
                    ) : (
                        projects.map(project => (
                            <button
                                key={project.id}
                                onClick={() => {
                                    setActiveProject(project);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors truncate ${activeProject?.id === project.id
                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                        : 'hover:bg-white/50 text-slate-600'
                                    }`}
                                title={project.name}
                            >
                                {project.name}
                            </button>
                        ))
                    )}
                    <Link
                        href="/dashboard/projects"
                        className="block px-2 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-md font-medium border-t border-slate-200/50 mt-1"
                        onClick={() => setIsOpen(false)}
                    >
                        Manage Projects
                    </Link>
                </div>
            )}
        </div>
    );
}
