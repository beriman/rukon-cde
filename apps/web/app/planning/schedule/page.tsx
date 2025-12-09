
import { GanttChart } from '@/components/planning/GanttChart';

export default function SchedulePage() {
    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">Delivery Schedule</h1>
            <GanttChart />
        </div>
    );
}
