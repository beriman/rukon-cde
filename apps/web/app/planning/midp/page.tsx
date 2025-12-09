
import { MIDPViewer } from '@/components/planning/MIDPViewer';

export default function MIDPPage() {
    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">Master Information Delivery Plan (MIDP)</h1>
            <MIDPViewer />
        </div>
    );
}
