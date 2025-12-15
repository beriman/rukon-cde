import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ScheduleTask {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    status: string;
    planId?: string;
}

export const scheduleService = {
    getTasks: async (projectId: string): Promise<ScheduleTask[]> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/projects/${projectId}/schedule/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    createPlan: async (projectId: string, name: string) => {
        const token = localStorage.getItem('token');
        return axios.post(`${API_URL}/projects/${projectId}/schedule/plans`, { name }, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    // Helper to create task (mostly for testing/seeding)
    createTask: async (projectId: string, planId: string, task: Partial<ScheduleTask>) => {
        const token = localStorage.getItem('token');
        return axios.post(`${API_URL}/projects/${projectId}/schedule/plans/${planId}/tasks`, task, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
};
