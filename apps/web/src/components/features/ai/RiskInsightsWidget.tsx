/**
 * Risk Insights Widget
 * Story 7.6: AI Risk Insights
 */
import React, { useState, useEffect } from 'react';

interface RiskInsight {
    id: string;
    type: 'schedule' | 'bcf' | 'weather' | 'general';
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    recommendation: string;
}

interface RiskInsightsWidgetProps {
    projectId: string;
    apiBaseUrl: string;
    authToken: string;
}

const SeverityBadge: React.FC<{ severity: 'high' | 'medium' | 'low' }> = ({ severity }) => {
    const config = {
        high: { bg: 'bg-red-100', text: 'text-red-700', icon: '🔴' },
        medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '🟡' },
        low: { bg: 'bg-green-100', text: 'text-green-700', icon: '🟢' },
    };
    const { bg, text, icon } = config[severity];

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>
            {icon} {severity}
        </span>
    );
};

export const RiskInsightsWidget: React.FC<RiskInsightsWidgetProps> = ({
    projectId,
    apiBaseUrl,
    authToken,
}) => {
    const [insights, setInsights] = useState<RiskInsight[]>([]);
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchInsights();
    }, [projectId]);

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBaseUrl}/ai/insights/${projectId}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            const data = await res.json();
            setInsights(data.insights || []);
            setSummary(data.summary || '');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow p-6">
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span>⚠️</span> AI Risk Insights
                </h3>
                <button
                    onClick={fetchInsights}
                    className="text-sm text-blue-600 hover:text-blue-700"
                >
                    Refresh
                </button>
            </div>

            {/* Summary */}
            {summary && (
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm text-gray-600">{summary}</p>
                </div>
            )}

            {/* Insights List */}
            <div className="divide-y divide-gray-100">
                {insights.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                        <span className="text-3xl">✅</span>
                        <p className="mt-2">No significant risks detected</p>
                    </div>
                ) : (
                    insights.map(insight => (
                        <div key={insight.id} className="px-4 py-3 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <SeverityBadge severity={insight.severity} />
                                        <span className="text-xs text-gray-400 uppercase">{insight.type}</span>
                                    </div>
                                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                                    <p className="text-sm text-blue-600 mt-2">
                                        💡 {insight.recommendation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RiskInsightsWidget;
