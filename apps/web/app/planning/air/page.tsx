
import { AIRWizard } from '@/components/planning/AIRWizard';

export default function AIRPage() {
    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">Asset Information Requirements (AIR)</h1>
            <AIRWizard />
        </div>
    );
}
