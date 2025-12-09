
import { EIRWizard } from '@/components/planning/EIRWizard';

export default function EIRPage() {
    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">Exchange Information Requirements (EIR)</h1>
            <EIRWizard />
        </div>
    );
}
