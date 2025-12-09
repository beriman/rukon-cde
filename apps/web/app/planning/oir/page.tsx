
import { OIRWizard } from '@/components/planning/OIRWizard';

export default function OIRPage() {
    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">Organizational Information Requirements (OIR)</h1>
            <OIRWizard />
        </div>
    );
}
