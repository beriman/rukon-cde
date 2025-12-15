import { useQuery } from '@tanstack/react-query';
import { hseService } from '@/lib/api/hse.service';

export const useHseStats = (projectId: string) => {
    return useQuery({
        queryKey: ['hse-stats', projectId],
        queryFn: () => hseService.getStats(projectId),
        enabled: !!projectId,
    });
};

export const useHseStatsWithTrends = (projectId: string) => {
    return useQuery({
        queryKey: ['hse-stats-trends', projectId],
        queryFn: () => hseService.getStatsWithTrends(projectId),
        enabled: !!projectId,
    });
};
