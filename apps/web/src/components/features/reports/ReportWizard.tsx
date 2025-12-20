/**
 * Report Generation Wizard
 * Story 7.10: Automated Reporting & Story 7.11: Custom Report Builder
 */
import React, { useState, useEffect } from 'react';

interface ReportPreview {
    period: { startDate: string; endDate: string; type: string };
    data: {
        scheduleStats: { totalTasks: number; completedTasks: number; progressPercentage: number };
        hseStats: { totalIncidents: number; safeWorkDays: number };
        rfiStats: { totalRfis: number; openRfis: number };
        bcfStats: { totalIssues: number; resolvedIssues: number };
        photos: Array<{ id: string; url: string; caption: string }>;
    };
}

interface ReportWizardProps {
    projectId: string;
    apiBaseUrl: string;
    authToken: string;
    onGenerated?: (report: any) => void;
    onClose?: () => void;
}

const SECTIONS = [
    { id: 'executive', name: 'Executive Summary', icon: '📝' },
    { id: 'schedule', name: 'Schedule Progress', icon: '📅' },
    { id: 'hse', name: 'Safety & HSE', icon: '🦺' },
    { id: 'rfi', name: 'RFI/Submittals', icon: '📋' },
    { id: 'bcf', name: 'BCF Issues', icon: '🔧' },
    { id: 'photos', name: 'Progress Photos', icon: '📷' },
];

export const ReportWizard: React.FC<ReportWizardProps> = ({
    projectId,
    apiBaseUrl,
    authToken,
    onGenerated,
    onClose,
}) => {
    const [step, setStep] = useState(1);
    const [reportType, setReportType] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');
    const [selectedSections, setSelectedSections] = useState(SECTIONS.map(s => s.id));
    const [executiveSummary, setExecutiveSummary] = useState('');
    const [preview, setPreview] = useState<ReportPreview | null>(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    const fetchPreview = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBaseUrl}/reports/preview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ projectId, type: reportType }),
            });
            const data = await res.json();
            setPreview(data);
        } catch (err) {
            console.error('Preview failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (step === 2) {
            fetchPreview();
        }
    }, [step, reportType]);

    const generateReport = async () => {
        setGenerating(true);
        try {
            const res = await fetch(`${apiBaseUrl}/reports/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    projectId,
                    type: reportType,
                    executiveSummary,
                }),
            });
            const report = await res.json();
            onGenerated?.(report);
        } catch (err) {
            console.error('Generation failed');
        } finally {
            setGenerating(false);
        }
    };

    const toggleSection = (sectionId: string) => {
        setSelectedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(s => s !== sectionId)
                : [...prev, sectionId]
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-lg max-w-3xl mx-auto">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                    📊 Generate Report
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-center gap-8">
                    {['Period', 'Preview', 'Generate'].map((label, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step > i + 1 ? 'bg-green-500 text-white' :
                                    step === i + 1 ? 'bg-blue-600 text-white' :
                                        'bg-gray-200 text-gray-500'
                                }`}>
                                {step > i + 1 ? '✓' : i + 1}
                            </div>
                            <span className={step === i + 1 ? 'font-medium' : 'text-gray-500'}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Report Period</label>
                            <div className="grid grid-cols-2 gap-4">
                                {(['WEEKLY', 'MONTHLY'] as const).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setReportType(type)}
                                        className={`p-4 rounded-lg border-2 text-center transition ${reportType === type
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className="text-2xl">{type === 'WEEKLY' ? '📅' : '📆'}</span>
                                        <p className="font-medium mt-2">{type}</p>
                                        <p className="text-sm text-gray-500">
                                            {type === 'WEEKLY' ? 'Last 7 days' : 'Last 30 days'}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Include Sections</label>
                            <div className="grid grid-cols-2 gap-2">
                                {SECTIONS.map(section => (
                                    <label
                                        key={section.id}
                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${selectedSections.includes(section.id)
                                                ? 'bg-blue-50 border border-blue-200'
                                                : 'bg-gray-50 border border-transparent'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedSections.includes(section.id)}
                                            onChange={() => toggleSection(section.id)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span>{section.icon}</span>
                                        <span className="text-sm">{section.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        {loading ? (
                            <div className="animate-pulse space-y-3">
                                <div className="h-20 bg-gray-200 rounded"></div>
                                <div className="h-20 bg-gray-200 rounded"></div>
                            </div>
                        ) : preview && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Schedule Progress</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {preview.data.scheduleStats.progressPercentage}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Safe Work Days</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {preview.data.hseStats.safeWorkDays}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-yellow-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Open RFIs</p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {preview.data.rfiStats.openRfis}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <p className="text-sm text-gray-500">BCF Issues</p>
                                        <p className="text-2xl font-bold text-purple-600">
                                            {preview.data.bcfStats.totalIssues}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Executive Summary (Optional)
                                    </label>
                                    <textarea
                                        value={executiveSummary}
                                        onChange={e => setExecutiveSummary(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Add a summary for stakeholders..."
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center py-8">
                        {generating ? (
                            <>
                                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="mt-4 text-gray-600">Generating your report...</p>
                            </>
                        ) : (
                            <>
                                <span className="text-5xl">✅</span>
                                <h3 className="text-xl font-semibold mt-4">Report Generated!</h3>
                                <p className="text-gray-500 mt-2">Your report is ready for download.</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                <button
                    onClick={() => step > 1 && setStep(step - 1)}
                    disabled={step === 1}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                    Back
                </button>

                {step < 3 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Next
                    </button>
                ) : !generating && (
                    <button
                        onClick={generateReport}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Generate Report
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReportWizard;
