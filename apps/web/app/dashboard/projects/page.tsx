'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { FolderOpen, Plus, Loader2, Edit2, Archive, RotateCcw, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { EditProjectModal } from '@/components/projects/edit-project-modal';
import { CreateProjectModal } from '@/components/projects/create-project-modal';
import { ConfirmationDialog } from '@/components/confirmation-dialog';

interface Project {
    id: string;
    name: string;
    description?: string;
    status: string;
    createdAt: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showArchived, setShowArchived] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [archivingProjectId, setArchivingProjectId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, [showArchived]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (!showArchived) params.status = 'ACTIVE';

            const res = await apiClient.get('/projects', { params });
            setProjects(res.data || []);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleArchive = async (projectId: string) => {
        try {
            await apiClient.patch(`/projects/${projectId}/archive`);
            fetchProjects();
            setArchivingProjectId(null);
        } catch (err) {
            console.error('Failed to archive project:', err);
            alert('Failed to archive project');
        }
    };

    const handleRestore = async (projectId: string) => {
        try {
            await apiClient.patch(`/projects/${projectId}/restore`);
            fetchProjects();
        } catch (err) {
            console.error('Failed to restore project:', err);
            alert('Failed to restore project');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Projects</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your construction projects</p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                        <input
                            type="checkbox"
                            checked={showArchived}
                            onChange={(e) => setShowArchived(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-2 focus:ring-blue-600"
                        />
                        Show Archived
                    </label>
                    <button
                        onClick={() => {
                            console.log('New Project button clicked');
                            setIsCreateModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer relative z-50"
                    >
                        <Plus className="w-4 h-4" />
                        New Project
                    </button>
                </div>
            </div>

            {/* Projects Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-zinc-500">
                            No projects yet. Create your first project to get started.
                        </div>
                    ) : (
                        projects.map((project) => (
                            <div
                                key={project.id}
                                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:border-blue-600 dark:hover:border-blue-600 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <Link href={`/dashboard/projects/${project.id}`} className="flex items-start gap-4 flex-1 min-w-0">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                            <FolderOpen className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-zinc-900 dark:text-white truncate">{project.name}</h3>
                                            {project.description && (
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{project.description}</p>
                                            )}
                                            <div className="flex items-center gap-2 mt-3">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${project.status === 'ACTIVE'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                                                    }`}>
                                                    {project.status}
                                                </span>
                                                <span className="text-xs text-zinc-400">
                                                    {new Date(project.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingProject(project);
                                            }}
                                            className="p-2 text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                                            title="Edit project"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        {project.status === 'ACTIVE' ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setArchivingProjectId(project.id);
                                                }}
                                                className="p-2 text-zinc-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                                                title="Archive project"
                                            >
                                                <Archive className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRestore(project.id);
                                                }}
                                                className="p-2 text-zinc-600 hover:text-green-600 dark:text-zinc-400 dark:hover:text-green-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                                                title="Restore project"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Create Project Modal */}
            {isCreateModalOpen && (
                <CreateProjectModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => {
                        fetchProjects();
                        setIsCreateModalOpen(false);
                    }}
                />
            )}

            {/* Edit Project Modal */}
            {editingProject && (
                <EditProjectModal
                    project={editingProject}
                    onClose={() => setEditingProject(null)}
                    onSuccess={() => {
                        fetchProjects();
                        setEditingProject(null);
                    }}
                />
            )}

            {/* Archive Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={archivingProjectId !== null}
                onClose={() => setArchivingProjectId(null)}
                onConfirm={() => archivingProjectId && handleArchive(archivingProjectId)}
                title="Archive Project"
                message="Are you sure you want to archive this project? Archived projects are read-only and no new files can be uploaded."
                confirmText="Archive"
                confirmVariant="danger"
            />
        </div>
    );
}
