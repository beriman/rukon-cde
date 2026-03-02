import { apiClient } from '../api-client';

export interface HseMonthlyTrend {
    month: string;
    incidents: number;
    manhours: number;
    ltiRate: number;
    triRate: number;
}

export interface HseStats {
    totalManhours: number;
    ltiFreeDays: number;
    recordableFreeDays: number;
    hurtFreeDays: number;
    ltiRate: number;
    triRate: number;
    incidentsLastMonth: number;
    monthlyTrends?: HseMonthlyTrend[];
}

export interface Inspection {
    id: string;
    type: string;
    date: string;
    inspector: {
        name: string;
        email: string;
    };
    items: Array<{
        question: string;
        result: 'PASS' | 'FAIL' | 'NA';
        comment?: string;
    }>;
}

export const hseService = {
    async getStats(projectId: string): Promise<HseStats> {
        const { data } = await apiClient.get(`/projects/${projectId}/hse/stats/trends`);
        return data;
    },

    // Alias for compatibility with older components
    async getStatsWithTrends(projectId: string): Promise<HseStats> {
        return this.getStats(projectId);
    },

    async getDashboard(projectId: string): Promise<any> {
        const { data } = await apiClient.get(`/projects/${projectId}/hse/dashboard`);
        return data;
    },

    async getInspections(projectId: string, page = 1): Promise<{ data: Inspection[], meta: any }> {
        const { data } = await apiClient.get(`/projects/${projectId}/hse/inspections?page=${page}`);
        return data;
    },

    async getMeetings(projectId: string, page = 1): Promise<any> {
        const { data } = await apiClient.get(`/projects/${projectId}/hse/meetings?page=${page}`);
        return data;
    }
};
