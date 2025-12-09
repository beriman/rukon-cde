'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, UserPlus } from 'lucide-react';

interface Personnel {
    id: string;
    name: string;
    company: string;
    role?: string;
    documents: any[];
    createdAt: string;
}

export default function PersonnelPage() {
    const [projectId, setProjectId] = useState<string>('');
    const [projects, setProjects] = useState<any[]>([]);
    const [personnel, setPersonnel] = useState<Personnel[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        role: '',
        documents: [{ type: 'SIO', number: '', expiry: '' }],
    });

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await apiClient.get('/projects', { params: { status: 'ACTIVE' } });
            setProjects(res.data || []);
            if (res.data && res.data.length > 0) {
                setProjectId(res.data[0].id);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        if (!projectId) return;
        const fetchPersonnel = async () => {
            setLoading(true);
            try {
                const res = await apiClient.get(`/projects/${projectId}/personnel`);
                setPersonnel(res.data || []);
            } catch (error) {
                console.error('Failed to fetch personnel', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPersonnel();
    }, [projectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post(`/projects/${projectId}/personnel`, formData);
            setShowForm(false);
            setFormData({ name: '', company: '', role: '', documents: [{ type: 'SIO', number: '', expiry: '' }] });
            // Refresh list
            const res = await apiClient.get(`/projects/${projectId}/personnel`);
            setPersonnel(res.data || []);
        } catch (error) {
            console.error('Failed to create personnel', error);
            alert('Failed to create personnel');
        }
    };

    const getExpiryStatus = (expiry: string) => {
        if (!expiry) return 'text-gray-500';
        const expiryDate = new Date(expiry);
        const today = new Date();
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0) return 'text-red-600 font-bold'; // Expired
        if (daysUntilExpiry < 30) return 'text-yellow-600 font-semibold'; // Warning
        return 'text-green-600'; // OK
    };

    if (loading && projects.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Personnel Database</h2>
                    <p className="text-sm text-muted-foreground">Manage workers and certifications</p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                    >
                        {projects.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <Button onClick={() => setShowForm(!showForm)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Worker
                    </Button>
                </div>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Worker</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Input
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Input
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="e.g., Operator, Rigger"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>SIO Number</Label>
                                    <Input
                                        value={formData.documents[0]?.number}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            documents: [{ ...formData.documents[0], number: e.target.value }],
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Expiry Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.documents[0]?.expiry}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            documents: [{ ...formData.documents[0], expiry: e.target.value }],
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Save Worker</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Workers ({personnel.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="text-left p-3">Name</th>
                                        <th className="text-left p-3">Company</th>
                                        <th className="text-left p-3">Role</th>
                                        <th className="text-left p-3">SIO Status</th>
                                        <th className="text-left p-3">Expiry Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {personnel.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center p-8 text-muted-foreground">
                                                No workers added yet
                                            </td>
                                        </tr>
                                    ) : (
                                        personnel.map((person) => (
                                            <tr key={person.id} className="border-b hover:bg-muted/50">
                                                <td className="p-3 font-medium">{person.name}</td>
                                                <td className="p-3">{person.company}</td>
                                                <td className="p-3">{person.role || '-'}</td>
                                                <td className="p-3">
                                                    {person.documents[0]?.number || 'No SIO'}
                                                </td>
                                                <td className={`p-3 ${getExpiryStatus(person.documents[0]?.expiry)}`}>
                                                    {person.documents[0]?.expiry
                                                        ? new Date(person.documents[0].expiry).toLocaleDateString()
                                                        : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
