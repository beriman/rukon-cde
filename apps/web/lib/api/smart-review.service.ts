import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ValidationRule {
    id: string;
    name: string;
    description?: string;
    category: string;
    ruleType: 'REGEX' | 'EXISTS' | 'VALUE';
    config: Record<string, any>;
    isActive: boolean;
}

export interface ValidationReport {
    id: string;
    projectId: string;
    modelId: string;
    result: any;
    score: number;
    createdAt: string;
}

export const smartReviewService = {
    getRules: async (): Promise<ValidationRule[]> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/smart-review/rules`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    createRule: async (data: Omit<ValidationRule, 'id' | 'isActive'>): Promise<ValidationRule> => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/smart-review/rules`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    createReport: async (data: { projectId: string; modelId: string; result: any; score: number }): Promise<ValidationReport> => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/smart-review/reports`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    getReports: async (projectId: string, modelId?: string): Promise<ValidationReport[]> => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/smart-review/reports/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { modelId },
        });
        return response.data;
    },
};
