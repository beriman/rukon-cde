'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { Upload, X, File, Loader2 } from 'lucide-react';

interface FileUploadProps {
    folderId: string;
    projectId: string;
    onUploadComplete?: () => void;
}

interface UploadingFile {
    file: File;
    progress: number;
    error?: string;
}

export function FileUpload({ folderId, projectId, onUploadComplete }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    }, [folderId, projectId]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    };

    const handleFiles = async (files: File[]) => {
        const newUploadingFiles = files.map(file => ({ file, progress: 0 }));
        setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

        for (let i = 0; i < files.length; i++) {
            await uploadFile(files[i], uploadingFiles.length + i);
        }
    };

    const uploadFile = async (file: File, index: number) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            await apiClient.post(
                `/projects/${projectId}/folders/${folderId}/files`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const progress = progressEvent.total
                            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            : 0;
                        setUploadingFiles(prev =>
                            prev.map((f, i) => i === index ? { ...f, progress } : f)
                        );
                    },
                }
            );

            // Remove from uploading list after success
            setTimeout(() => {
                setUploadingFiles(prev => prev.filter((_, i) => i !== index));
                onUploadComplete?.();
            }, 1000);
        } catch (err: any) {
            setUploadingFiles(prev =>
                prev.map((f, i) =>
                    i === index ? { ...f, error: err.response?.data?.message || 'Upload failed' } : f
                )
            );
        }
    };

    const removeFile = (index: number) => {
        setUploadingFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${isDragging
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10'
                        : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'
                    }
        `}
            >
                <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-zinc-400 mb-4" />
                    <p className="text-sm font-medium text-zinc-900 dark:text-white mb-1">
                        Drop files here or click to browse
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Supports all file types
                    </p>
                </label>
            </div>

            {/* Uploading Files List */}
            {uploadingFiles.length > 0 && (
                <div className="space-y-2">
                    {uploadingFiles.map((uploadingFile, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                        >
                            <File className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                                    {uploadingFile.file.name}
                                </p>
                                {uploadingFile.error ? (
                                    <p className="text-xs text-red-500">{uploadingFile.error}</p>
                                ) : (
                                    <div className="mt-1 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5">
                                        <div
                                            className="bg-blue-600 h-1.5 rounded-full transition-all"
                                            style={{ width: `${uploadingFile.progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                            {uploadingFile.progress === 100 && !uploadingFile.error ? (
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            ) : (
                                <button
                                    onClick={() => removeFile(index)}
                                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                                >
                                    <X className="w-4 h-4 text-zinc-400" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
