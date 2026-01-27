'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Send } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function NewCorrespondencePage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.projectId || 'demo-project-1';

    const [loading, setLoading] = useState(false);
    const [isOfficial, setIsOfficial] = useState(false);
    const [formData, setFormData] = useState({
        type: 'SITE_MEMO',
        subject: '',
        to: '',
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await apiClient.post('/construction/correspondence', {
                ...formData,
                projectId,
                category: isOfficial ? 'OFFICIAL_LETTER' : 'GENERAL',
                to: formData.to.split(',').map(s => s.trim()), // Simple split
                attachments: []
            });
            router.push(`/dashboard/construction/correspondence`);
        } catch (error) {
            console.error('Failed to send', error);
            alert('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">New Correspondence</h1>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader className="bg-slate-50/50 border-b pb-4">
                        <CardTitle className="text-lg">Compose Message</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-6">
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="official-mode"
                                    checked={isOfficial}
                                    onCheckedChange={(checked) => setIsOfficial(checked as boolean)}
                                />
                                <div className="space-y-0.5">
                                    <Label htmlFor="official-mode" className="text-base font-semibold cursor-pointer">
                                        Send as Official Letter (Surat Resmi)
                                    </Label>
                                    <p className="text-xs text-slate-500">Generates immutable PDF with Letterhead</p>
                                </div>
                            </div>

                            {isOfficial && (
                                <div className="flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 animate-in fade-in slide-in-from-right-2">
                                    <FileText className="w-3.5 h-3.5" />
                                    PDF Will Be Generated
                                </div>
                            )}
                        </div>

                        {isOfficial && (
                            <p className="text-xs text-slate-500 italic bg-amber-50 p-2 rounded text-amber-700 border border-amber-100">
                                Note: This will use the Letterhead configuration from your Organization Settings.
                            </p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SITE_MEMO">Site Memo</SelectItem>
                                        <SelectItem value="SITE_INSTRUCTION">Site Instruction</SelectItem>
                                        <SelectItem value="RFI">Request for Information</SelectItem>
                                        <SelectItem value="NOTICE">Official Notice</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>To (Recipient)</Label>
                                <Input
                                    placeholder="e.g. PT. Contractor, Mr. Smith..."
                                    value={formData.to}
                                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input
                                placeholder="Enter specific subject..."
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                                className="font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Message Content</Label>
                            <Textarea
                                placeholder="Type your formal message here..."
                                className="min-h-[250px] font-sans text-base leading-relaxed"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                        </div>

                        <div className="pt-6 flex justify-end gap-3 border-t">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={loading} className="gap-2 min-w-[120px]">
                                <Send className="w-4 h-4" />
                                {loading ? 'Sending...' : (isOfficial ? 'Generate PDF & Send' : 'Send Message')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
