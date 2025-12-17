import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface ValidationResult {
    elementId: string;
    elementName?: string;
    type: string;
    status: 'PASS' | 'FAIL';
    failedRules: string[];
}

export function ValidationPanel({ projectId }: { projectId: string }) {
    const [results, setResults] = useState<ValidationResult[]>([]);
    const [running, setRunning] = useState(false);
    const [summary, setSummary] = useState({ total: 0, passed: 0, failed: 0 });

    const handleRunValidation = async () => {
        setRunning(true);
        // Simulate API call delay
        await new Promise(r => setTimeout(r, 1500));

        // Mock Results
        const mockResults: ValidationResult[] = [
            { elementId: 'guid-1', elementName: 'Basic Wall:200mm', type: 'IfcWall', status: 'PASS', failedRules: [] },
            { elementId: 'guid-2', elementName: 'Basic Wall:200mm', type: 'IfcWall', status: 'PASS', failedRules: [] },
            { elementId: 'guid-3', elementName: 'Curtain Wall', type: 'IfcWall', status: 'FAIL', failedRules: ['Missing Property: FireRating in Pset_WallCommon'] },
            { elementId: 'guid-4', elementName: 'Int Door', type: 'IfcDoor', status: 'FAIL', failedRules: ['Value Mismatch: FireRating = 30, expected 60'] },
        ];

        setResults(mockResults);
        setSummary({
            total: mockResults.length,
            passed: mockResults.filter(r => r.status === 'PASS').length,
            failed: mockResults.filter(r => r.status === 'FAIL').length
        });
        setRunning(false);
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="py-3 px-4 border-b bg-slate-50">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">Validation Results</CardTitle>
                    <div className="flex items-center gap-4">
                        {summary.total > 0 && (
                            <div className="flex gap-2 text-xs">
                                <span className="text-slate-500">Total: {summary.total}</span>
                                <span className="text-green-600 font-semibold">Passed: {summary.passed}</span>
                                <span className="text-red-600 font-semibold">Failed: {summary.failed}</span>
                            </div>
                        )}
                        <Button size="sm" onClick={handleRunValidation} disabled={running} className="h-8">
                            <PlayCircle className={`w-4 h-4 mr-2 ${running ? 'animate-spin' : ''}`} />
                            {running ? 'Validating...' : 'Run Check'}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
                {results.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <AlertTriangle className="w-12 h-12 mb-2 opacity-20" />
                        <p className="text-sm">No validation results yet</p>
                        <p className="text-xs">Run a validation check to see compliance status</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {results.map((res, i) => (
                            <div key={i} className="p-3 hover:bg-slate-50 flex flex-col gap-1">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={res.status === 'PASS' ? 'default' : 'destructive'} className={res.status === 'PASS' ? 'bg-green-600' : ''}>
                                            {res.status}
                                        </Badge>
                                        <span className="font-medium text-sm">{res.elementName || 'Unnamed Element'}</span>
                                        <span className="text-xs text-slate-400 font-mono">({res.elementId})</span>
                                    </div>
                                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">{res.type}</span>
                                </div>
                                {res.failedRules.length > 0 && (
                                    <div className="ml-2 pl-2 border-l-2 border-red-200 mt-1">
                                        {res.failedRules.map((rule, j) => (
                                            <p key={j} className="text-xs text-red-600 flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" />
                                                {rule}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
