import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface SimulationLink {
    id: string;
    projectId: string;
    taskId: string;
    elementId: string;
    modelId: string;
    config?: any;
}

export const simulationService = {
    getLinks: async (projectId: string): Promise<SimulationLink[]> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/projects/${projectId}/simulation/links`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    createLink: async (projectId: string, data: { taskId: string; elementId: string; modelId: string; config?: any }): Promise<SimulationLink> => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/projects/${projectId}/simulation/links`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    deleteLink: async (projectId: string, id: string): Promise<void> => {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/projects/${projectId}/simulation/links/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
};
