import { apiClient } from '@/lib/api-client';

export interface HseStatsData {
    totalManhours: number;
    ltiFreeDays: number;
    recordableFreeDays: number;
    hurtFreeDays: number;
    ltiRate: number;
    triRate: number;
    incidentsLastMonth: number;
}

export interface HseMonthlyTrend {
    month: string;
    incidents: number;
    manhours: number;
    ltiRate: number;
    triRate: number;
}

export interface HseStatsWithTrends extends HseStatsData {
    monthlyTrends: HseMonthlyTrend[];
}

export const hseService = {
    getStats: async (projectId: string) => {
        const response = await apiClient.get<HseStatsData>(`/projects/${projectId}/hse/stats`);
        return response.data;
    },

    getStatsWithTrends: async (projectId: string) => {
        const response = await apiClient.get<HseStatsWithTrends>(`/projects/${projectId}/hse/stats/trends`);
        return response.data;
    }
};
