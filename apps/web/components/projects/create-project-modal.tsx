'use client';

import { useState, useEffect, FormEvent } from 'react';
import { apiClient } from '@/lib/api-client';
import { X, Loader2, Building2, Plus, ArrowRight } from 'lucide-react';

interface Organization {
    id: string;
    name: string;
    slug: string;
}

interface CreateProjectModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateProjectModal({ onClose, onSuccess }: CreateProjectModalProps) {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    // Organization State
    const [organizationId, setOrganizationId] = useState('');
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [isNewOrg, setIsNewOrg] = useState(false);
    const [newOrgName, setNewOrgName] = useState('');

    // UI States
    const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Fetch user's organizations on mount
    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const res = await apiClient.get('/organizations');
                const orgs = res.data;
                setOrganizations(orgs);

                if (orgs.length > 0) {
                    setOrganizationId(orgs[0].id);
                } else {
                    // Automatically switch to "New Org" mode if none exist
                    setIsNewOrg(true);
                }
            } catch (err) {
                console.error('Failed to fetch organizations', err);
                // Don't error block, just let them create new
                setIsNewOrg(true);
            } finally {
                setIsLoadingOrgs(false);
            }
        };

        fetchOrgs();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!isNewOrg && !organizationId) {
            setError('Please select an organization');
            setIsSubmitting(false);
            return;
        }

        if (isNewOrg && !newOrgName.trim()) {
            setError('Please enter an organization name');
            setIsSubmitting(false);
            return;
        }

        try {
            const payload: any = {
                name,
                code,
            };

            if (isNewOrg) {
                payload.newOrganizationName = newOrgName;
            } else {
                payload.organizationId = organizationId;
            }

            await apiClient.post('/projects', payload);
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Create project error:', err);
            setError(err.response?.data?.message || 'Failed to create project');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-generate code from name if code is empty
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        if (!code && newName) {
            // Simple acronym generation
            const generated = newName
                .split(' ')
                .map(part => part[0])
                .join('')
                .toUpperCase()
                .slice(0, 4);
            setCode(generated);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                        Create New Project
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Organization Section */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Organization *
                            </label>
                            {organizations.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setIsNewOrg(!isNewOrg)}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    {isNewOrg ? 'Select Existing' : 'Create New'}
                                </button>
                            )}
                        </div>

                        {isLoadingOrgs ? (
                            <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Loading organizations...
                            </div>
                        ) : isNewOrg ? (
                            <div className="space-y-1">
                                <input
                                    type="text"
                                    value={newOrgName}
                                    onChange={(e) => setNewOrgName(e.target.value)}
                                    placeholder="Enter new organization name..."
                                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                                    required
                                />
                                <p className="text-xs text-zinc-500">
                                    A new organization will be created with you as the owner.
                                </p>
                            </div>
                        ) : (
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <select
                                    value={organizationId}
                                    onChange={(e) => setOrganizationId(e.target.value)}
                                    required={!isNewOrg}
                                    className="w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-zinc-800 dark:text-white appearance-none"
                                >
                                    <option value="" disabled>Select Organization</option>
                                    {organizations.map(org => (
                                        <option key={org.id} value={org.id}>
                                            {org.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Project Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Project Name *
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            required
                            placeholder="e.g. Grand City Mall"
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                        />
                    </div>

                    {/* Project Code */}
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Project Code *
                        </label>
                        <input
                            id="code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            required
                            placeholder="e.g. GCM"
                            maxLength={10}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-zinc-800 dark:text-white uppercase font-mono"
                        />
                        <p className="text-xs text-zinc-500 mt-1">
                            Unique identifier (max 10 chars). Used for file naming (ISO 19650).
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoadingOrgs || (!isNewOrg && !organizationId) || (isNewOrg && !newOrgName)}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Creating...
                                </>
                            ) : (
                                'Create Project'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
