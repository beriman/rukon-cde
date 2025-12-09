'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/useAuthStore';
import { Breadcrumb } from '@/components/files/breadcrumb';
import { FileUpload } from '@/components/files/file-upload';
import { FolderPlus, Upload, Folder, FileText, Loader2, Download, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface FolderType {
    id: string;
    name: string;
    createdAt: string;
}

interface FileType {
    id: string;
    fileName: string;
    fileSize: number;
    currentVersion: number;
    cdeState: 'WIP' | 'SHARED' | 'PUBLISHED';
    uploadedBy: string;
    createdAt: string;
}

interface Project {
    id: string;
    name: string;
}

export default function ProjectDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const { user } = useAuthStore();
    const projectId = params.id as string;
    const folderId = searchParams.get('folder');

    const [project, setProject] = useState<Project | null>(null);
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [files, setFiles] = useState<FileType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [path, setPath] = useState<{ name: string; href?: string }[]>([]);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [promotingId, setPromotingId] = useState<string | null>(null);

    useEffect(() => {
        if (projectId) {
            fetchProjectData();
        }
    }, [projectId, folderId]);

    const fetchProjectData = async () => {
        setLoading(true);
        try {
            const projectRes = await apiClient.get(`/projects/${projectId}`);
            setProject(projectRes.data);

            const breadcrumb = [
                { name: 'Projects', href: '/dashboard/projects' },
                { name: projectRes.data.name, href: `/dashboard/projects/${projectId}` },
            ];

            if (folderId) {
                const folderRes = await apiClient.get(`/folders/${folderId}`);
                breadcrumb.push({ name: folderRes.data.name, href: `/dashboard/projects/${projectId}?folder=${folderId}` });

                const filesRes = await apiClient.get(`/folders/${folderId}/files`);
                setFiles(filesRes.data || []);

                const subfoldersRes = await apiClient.get(`/folders/${folderId}/subfolders`);
                setFolders(subfoldersRes.data || []);
            } else {
                const foldersRes = await apiClient.get(`/projects/${projectId}/folders`);
                setFolders(foldersRes.data || []);
                setFiles([]);
            }

            setPath(breadcrumb);
        } catch (err) {
            console.error('Failed to fetch project data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (fileId: string, fileName: string) => {
        setDownloadingId(fileId);
        try {
            const response = await apiClient.get(`/files/${fileId}/download`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
            alert('Failed to download file');
        } finally {
            setDownloadingId(null);
        }
    };

    const handlePromote = async (fileId: string) => {
        if (!confirm('Are you sure you want to promote this file to SHARED state?')) return;

        setPromotingId(fileId);
        try {
            await apiClient.post(`/files/${fileId}/promote`);
            fetchProjectData(); // Refresh to show updated state
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to promote file');
        } finally {
            setPromotingId(null);
        }
    };

    const handlePublish = async (fileId: string) => {
        if (!confirm('Are you sure you want to publish this file? This action is irreversible.')) return;

        setPromotingId(fileId);
        try {
            await apiClient.post(`/files/${fileId}/publish`);
            fetchProjectData(); // Refresh to show updated state
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to publish file');
        } finally {
            setPromotingId(null);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getStateBadge = (state: string) => {
        const colors = {
            WIP: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            SHARED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            PUBLISHED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        };
        return colors[state as keyof typeof colors] || 'bg-zinc-100 text-zinc-800';
    };

    const canPromote = (file: FileType) => {
        return file.cdeState === 'WIP' && (user?.role === 'INFO_MANAGER' || user?.role === 'ORG_ADMIN' || user?.role === 'LEAD_APPOINTED_PARTY');
    };

    const canPublish = (file: FileType) => {
        return file.cdeState === 'SHARED' && (user?.role === 'LEAD_APPOINTED_PARTY' || user?.role === 'ORG_ADMIN');
    };

    const currentFolderId = folderId || 'root';

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <Breadcrumb items={path} />
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {project?.name || 'Loading...'}
                    </h1>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                            <FolderPlus className="w-4 h-4" />
                            New Folder
                        </button>
                        <button
                            onClick={() => setShowUpload(!showUpload)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Files
                        </button>
                    </div>
                </div>
            </div>

            {showUpload && (
                <FileUpload
                    projectId={projectId}
                    folderId={currentFolderId}
                    onUploadComplete={() => {
                        fetchProjectData();
                        setShowUpload(false);
                    }}
                />
            )}

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {folders.map((folder) => (
                        <Link
                            key={folder.id}
                            href={`/dashboard/projects/${projectId}?folder=${folder.id}`}
                            className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:border-blue-600 dark:hover:border-blue-600 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Folder className="w-8 h-8 text-blue-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-zinc-900 dark:text-white truncate">{folder.name}</p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {new Date(folder.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
                        >
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <FileText className="w-8 h-8 text-zinc-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-zinc-900 dark:text-white truncate">{file.fileName}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            v{file.currentVersion} • {formatFileSize(file.fileSize)}
                                        </p>
                                        <p className="text-xs text-zinc-400 mt-1">
                                            {new Date(file.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* CDE State Badge */}
                                <div className="flex items-center justify-between">
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStateBadge(file.cdeState)}`}>
                                        {file.cdeState}
                                    </span>
                                    <button
                                        onClick={() => handleDownload(file.id, file.fileName)}
                                        disabled={downloadingId === file.id}
                                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors disabled:opacity-50"
                                        title="Download file"
                                    >
                                        {downloadingId === file.id ? (
                                            <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4 text-zinc-400" />
                                        )}
                                    </button>
                                </div>

                                {/* CDE Workflow Buttons */}
                                <div className="flex gap-2">
                                    {canPromote(file) && (
                                        <button
                                            onClick={() => handlePromote(file.id)}
                                            disabled={promotingId === file.id}
                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded transition-colors"
                                        >
                                            {promotingId === file.id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <>
                                                    <ArrowRight className="w-3 h-3" />
                                                    Promote to SHARED
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {canPublish(file) && (
                                        <button
                                            onClick={() => handlePublish(file.id)}
                                            disabled={promotingId === file.id}
                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded transition-colors"
                                        >
                                            {promotingId === file.id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-3 h-3" />
                                                    Publish
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {folders.length === 0 && files.length === 0 && (
                        <div className="col-span-full text-center py-12 text-zinc-500">
                            This folder is empty. Upload files or create a subfolder to get started.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
