'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PTWRequestPage({ params }: { params: { projectId: string } }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        type: '',
        location: '',
        validFrom: '',
        validTo: '',
        workDescription: '',
        hazards: '',
        controls: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch(`/api/projects/${params.projectId}/permits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            router.push(`/dashboard/projects/${params.projectId}/hse/ptw`);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Request Permit to Work</h1>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>PTW Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="type">Permit Type *</Label>
                            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="HOT_WORK">Hot Work</SelectItem>
                                    <SelectItem value="CONFINED_SPACE">Confined Space</SelectItem>
                                    <SelectItem value="WORK_AT_HEIGHT">Work at Height</SelectItem>
                                    <SelectItem value="EXCAVATION">Excavation</SelectItem>
                                    <SelectItem value="ELECTRICAL">Electrical Work</SelectItem>
                                    <SelectItem value="LIFTING">Lifting Operations</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="location">Work Location *</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g., Building A - Floor 3"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="validFrom">Valid From *</Label>
                                <Input
                                    id="validFrom"
                                    type="datetime-local"
                                    value={formData.validFrom}
                                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="validTo">Valid To *</Label>
                                <Input
                                    id="validTo"
                                    type="datetime-local"
                                    value={formData.validTo}
                                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="workDescription">Work Description *</Label>
                            <Textarea
                                id="workDescription"
                                value={formData.workDescription}
                                onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })}
                                placeholder="Describe the work to be performed..."
                                rows={4}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="hazards">Identified Hazards</Label>
                            <Textarea
                                id="hazards"
                                value={formData.hazards}
                                onChange={(e) => setFormData({ ...formData, hazards: e.target.value })}
                                placeholder="List potential hazards..."
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label htmlFor="controls">Control Measures</Label>
                            <Textarea
                                id="controls"
                                value={formData.controls}
                                onChange={(e) => setFormData({ ...formData, controls: e.target.value })}
                                placeholder="Describe control measures and safety precautions..."
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" className="flex-1">Submit Request</Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
