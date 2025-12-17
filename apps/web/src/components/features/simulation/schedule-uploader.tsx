'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload } from 'lucide-react';

interface ScheduleUploaderProps {
    projectId: string;
    onUploadSuccess: () => void;
}

export function ScheduleUploader({ projectId, onUploadSuccess }: ScheduleUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [type, setType] = useState('CSV');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleUpload = async () => {
        if (!file || !name || !type) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('type', type);
        formData.append('projectId', projectId);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/simulation/schedule/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            toast({
                title: 'Schedule uploaded',
                description: 'Your schedule has been successfully imported.',
            });
            onUploadSuccess();
            setFile(null);
            setName('');
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to upload schedule. Please check the file format.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Import Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Schedule Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Master Schedule Rev.1" />
                </div>

                <div className="space-y-2">
                    <Label>Format</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CSV">CSV (Simple)</SelectItem>
                            <SelectItem value="MS_PROJECT">MS Project (mpp) - Coming Soon</SelectItem>
                            <SelectItem value="P6">Primavera P6 (xml) - Coming Soon</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>File</Label>
                    <Input type="file" accept=".csv,.xml,.mpp" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </div>

                <Button className="w-full" onClick={handleUpload} disabled={!file || !name || loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Import Schedule
                </Button>
            </CardContent>
        </Card>
    );
}
