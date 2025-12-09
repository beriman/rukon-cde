
import { PIRWizard } from '@/components/planning/PIRWizard';

export default function PIRPage() {
    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">Project Information Requirements (PIR)</h1>
            <PIRWizard />
        </div>
    );
}
