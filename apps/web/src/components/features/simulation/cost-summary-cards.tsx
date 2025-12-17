import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Activity, CalendarClock } from 'lucide-react';

interface CostSummaryCardsProps {
    data: any[]; // DailyCashFlow[]
}

export function CostSummaryCards({ data }: CostSummaryCardsProps) {
    // Calculate Metrics
    const totalBudget = data.length > 0 ? data[data.length - 1].cumulativeCost : 0;
    const peakDailySpend = data.length > 0 ? Math.max(...data.map(d => d.dailyCost)) : 0;
    const durationDays = data.length;

    return (
        <div className="grid grid-cols-3 gap-4 mb-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Projected Cost</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Rp {totalBudget.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Based on current schedule</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Peak Daily Spend</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Rp {peakDailySpend.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Maximum daily burn rate</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Duration</CardTitle>
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{durationDays} Days</div>
                    <p className="text-xs text-muted-foreground">Financial timeline</p>
                </CardContent>
            </Card>
        </div>
    );
}
