
import { BEPEditor } from '@/components/planning/BEPEditor';

export default function BEPPage() {
    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">BIM Execution Plan (BEP) Editor</h1>
            <BEPEditor />
        </div>
    );
}
