
import { WorkflowBuilder } from '@/components/settings/WorkflowBuilder';

export default function WorkflowSettingsPage() {
    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">Approval Workflows</h1>
            <p className="text-gray-500 mb-8">Configure review and approval chains for document state transitions.</p>
            <WorkflowBuilder />
        </div>
    );
}
