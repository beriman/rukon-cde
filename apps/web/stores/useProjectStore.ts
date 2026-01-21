import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api-client';

export interface Project {
    id: string;
    name: string;
    description?: string;
    status: string;
    createdAt: string;
}

interface ProjectState {
    projects: Project[];
    activeProject: Project | null;
    isLoading: boolean;
    error: string | null;

    fetchProjects: () => Promise<void>;
    setActiveProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            projects: [],
            activeProject: null,
            isLoading: false,
            error: null,

            fetchProjects: async () => {
                set({ isLoading: true, error: null });
                try {
                    const res = await apiClient.get('/projects?status=ACTIVE');
                    const projects = res.data || [];
                    set({ projects, isLoading: false });

                    // If there's an active project, update it with fresh data
                    // Or if no active project is set, but projects exist, maybe set the first one?
                    // For now, let's keep the persistence behavior or manual selection.
                    const { activeProject } = get();
                    if (activeProject) {
                         const updated = projects.find((p: Project) => p.id === activeProject.id);
                         if (updated) {
                             set({ activeProject: updated });
                         } else {
                             // Active project might have been archived or deleted
                             set({ activeProject: null });
                         }
                    } else if (projects.length > 0) {
                        // Optional: Auto-select first project if none selected?
                        // set({ activeProject: projects[0] });
                    }

                } catch (err: any) {
                    console.error('Failed to fetch projects:', err);
                    set({ error: err.message || 'Failed to fetch projects', isLoading: false });
                }
            },

            setActiveProject: (project) => set({ activeProject: project }),
        }),
        {
            name: 'rukon-project-storage',
            partialize: (state) => ({ activeProject: state.activeProject }), // Only persist the active project
        }
    )
);
