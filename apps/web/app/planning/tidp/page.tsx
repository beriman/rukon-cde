
import { TIDPEditor } from '@/components/planning/TIDPEditor';

export default function TIDPPage() {
    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">Task Information Delivery Plan (TIDP)</h1>
            <TIDPEditor />
        </div>
    );
}
