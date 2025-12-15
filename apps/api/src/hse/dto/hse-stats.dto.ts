export class HseStatsDto {
    totalManhours: number;
    ltiFreeDays: number;
    recordableFreeDays: number;
    hurtFreeDays: number;
    ltiRate: number;
    triRate: number;
    incidentsLastMonth: number;
}

export class MonthlyTrendDto {
    month: string; // YYYY-MM
    incidents: number;
    manhours: number;
    ltiRate: number;
    triRate: number;
}

export class HseStatsWithTrendsDto extends HseStatsDto {
    monthlyTrends: MonthlyTrendDto[];
    previousBest: {
        ltiFreeDays: number;
        recordableFreeDays: number;
        date: string;
    };
}
