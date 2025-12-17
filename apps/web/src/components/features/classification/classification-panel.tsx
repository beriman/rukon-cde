import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Tag, Check, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ClassificationCode {
    code: string;
    description: string;
    system: string;
}

interface Assignment {
    id: string;
    elementGuid: string;
    code: string;
    description: string;
}

interface ClassificationPanelProps {
    projectId: string;
    selectedElementId?: string; // GUID from viewer
}

export function ClassificationPanel({ projectId, selectedElementId }: ClassificationPanelProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ClassificationCode[]>([]);
    const [loading, setLoading] = useState(false);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [selectedCode, setSelectedCode] = useState<ClassificationCode | null>(null);

    // Fetch existing assignments
    useEffect(() => {
        fetchAssignments();
    }, [projectId]);

    const fetchAssignments = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/classification/project/${projectId}`);
            setAssignments(res.data);
        } catch (error) {
            console.error("Failed to fetch assignments", error);
        }
    };

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/classification/search`, {
                params: { q: query }
            });
            setResults(res.data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedElementId || !selectedCode) return;
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/classification/assign`, {
                projectId,
                elementGuid: selectedElementId,
                code: selectedCode
            });
            fetchAssignments(); // Refresh
            alert(`Assigned ${selectedCode.code} to element!`);
        } catch (error) {
            console.error("Assignment failed", error);
            alert("Failed to assign code.");
        }
    };

    const currentAssignment = assignments.find(a => a.elementGuid === selectedElementId);

    return (
        <div className="flex flex-col h-full gap-4 mt-2">
            <Card>
                <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Selected Element</h3>
                        {selectedElementId ? (
                            <div className="p-2 bg-slate-50 border rounded text-xs font-mono">
                                {selectedElementId}
                                {currentAssignment && (
                                    <div className="mt-1 text-blue-600 font-semibold">
                                        {currentAssignment.code} - {currentAssignment.description}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-sm text-slate-500 italic">No element selected in 3D View</div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Search Uniclass (e.g. Wall)..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="h-8 text-xs"
                        />
                        <Button size="sm" onClick={handleSearch} disabled={loading} className="h-8">
                            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                        </Button>
                    </div>

                    <ScrollArea className="h-[200px] border rounded-md">
                        <div className="p-2 space-y-1">
                            {results.map((item) => (
                                <div
                                    key={item.code}
                                    onClick={() => setSelectedCode(item)}
                                    className={`p-2 rounded cursor-pointer text-xs flex flex-col hover:bg-slate-100 ${selectedCode?.code === item.code ? 'bg-blue-50 border-blue-200 border' : ''}`}
                                >
                                    <span className="font-bold">{item.code}</span>
                                    <span className="text-slate-600">{item.description}</span>
                                </div>
                            ))}
                            {results.length === 0 && !loading && <div className="text-center text-xs text-slate-400 py-4">No results</div>}
                        </div>
                    </ScrollArea>

                    <Button
                        size="sm"
                        className="w-full"
                        disabled={!selectedElementId || !selectedCode}
                        onClick={handleAssign}
                    >
                        <Tag className="w-3 h-3 mr-2" />
                        Assign Classification
                    </Button>
                </CardContent>
            </Card>

            <div className="flex-1 overflow-hidden flex flex-col">
                <h3 className="text-sm font-semibold mb-2">Project Assignments ({assignments.length})</h3>
                <ScrollArea className="flex-1 border rounded-md bg-white">
                    <div className="p-2 space-y-1">
                        {assignments.map(a => (
                            <div key={a.id} className="text-xs p-2 border-b last:border-0">
                                <span className="font-mono text-slate-500">{a.elementGuid.substring(0, 8)}...</span>
                                <span className="mx-2">→</span>
                                <span className="font-medium">{a.code}</span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
