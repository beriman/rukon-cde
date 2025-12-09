'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default function CobiePage() {
    const validation = {
        totalElements: 1250,
        compliantElements: 1063,
        complianceScore: 85.04,
        missingFields: [
            { elementId: 'Door-101', missingFields: ['FireRating', 'WarrantyStartDate'] },
            { elementId: 'Window-205', missingFields: ['TagNumber'] },
            { elementId: 'HVAC-301', missingFields: ['SerialNumber', 'InstallationDate'] },
        ],
    };

    const fieldBreakdown = [
        { field: 'Name', compliance: 100, status: 'complete' },
        { field: 'TypeName', compliance: 100, status: 'complete' },
        { field: 'Space', compliance: 98, status: 'complete' },
        { field: 'SerialNumber', compliance: 72, status: 'warning' },
        { field: 'InstallationDate', compliance: 68, status: 'warning' },
        { field: 'WarrantyStartDate', compliance: 45, status: 'warning' },
        { field: 'TagNumber', compliance: 82, status: 'warning' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">COBie & Data Compliance</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Overall Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <div className="text-6xl font-bold text-green-600 mb-2">
                            {validation.complianceScore}%
                        </div>
                        <p className="text-gray-500 mb-4">
                            {validation.compliantElements} / {validation.totalElements} elements compliant
                        </p>
                        <Progress value={validation.complianceScore} className="h-4" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Field-by-Field Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {fieldBreakdown.map(field => (
                        <div key={field.field} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {field.status === 'complete' ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                )}
                                <span className="font-medium">{field.field}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-32">
                                    <Progress value={field.compliance} className="h-2" />
                                </div>
                                <span className="text-sm font-semibold w-12 text-right">{field.compliance}%</span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        Elements with Missing Fields ({validation.missingFields.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {validation.missingFields.map((item, idx) => (
                            <div key={idx} className="border-l-4 border-yellow-400 pl-4 py-2">
                                <p className="font-semibold text-sm">{item.elementId}</p>
                                <p className="text-sm text-gray-600">
                                    Missing: {item.missingFields.join(', ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
