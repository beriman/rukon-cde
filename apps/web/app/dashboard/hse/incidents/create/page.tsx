'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function CreateIncidentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get('projectId');

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'NEAR_MISS',
        severity: 'LOW',
        date: new Date().toISOString().split('T')[0],
        location: '',
        description: '',
        witnesses: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId) return;

        setLoading(true);
        try {
            await apiClient.post(`/projects/${projectId}/incidents`, {
                ...formData,
                witnesses: formData.witnesses.split(',').map(w => w.trim()).filter(Boolean),
            });
            router.push('/dashboard/hse/incidents');
        } catch (error) {
            console.error('Failed to create incident', error);
            alert('Failed to create incident');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Report Incident</h2>
                    <p className="text-sm text-muted-foreground">Submit a new safety incident report</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Incident Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Incident Type</Label>
                                <select
                                    id="type"
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                >
                                    <option value="NEAR_MISS">Near Miss</option>
                                    <option value="UNSAFE_ACT">Unsafe Act</option>
                                    <option value="FIRST_AID">First Aid</option>
                                    <option value="MTI">Medical Treatment Injury</option>
                                    <option value="RWI">Restricted Work Injury</option>
                                    <option value="LTI">Lost Time Injury</option>
                                    <option value="FATALITY">Fatality</option>
                                    <option value="VEHICLE_INCIDENT">Vehicle Incident</option>
                                    <option value="SPILL">Environmental Spill</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="severity">Severity</Label>
                                <select
                                    id="severity"
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={formData.severity}
                                    onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="CRITICAL">Critical</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g., Level 3 - Zone A"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                className="w-full min-h-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Describe what happened..."
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="witnesses">Witnesses (comma-separated names)</Label>
                            <Input
                                id="witnesses"
                                placeholder="John Doe, Jane Smith"
                                value={formData.witnesses}
                                onChange={(e) => setFormData(prev => ({ ...prev, witnesses: e.target.value }))}
                            />
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Submit Report
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
