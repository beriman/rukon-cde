"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload } from 'lucide-react';
import axios from 'axios';

interface BoqUploaderProps {
    projectId: string;
    onUploadSuccess: () => void;
}

export function BoqUploader({ projectId, onUploadSuccess }: BoqUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleUpload = async () => {
        if (!file || !name) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/cost/boq/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast({
                title: 'BoQ Uploaded',
                description: 'Bill of Quantities imported successfully.',
            });
            onUploadSuccess();
            setFile(null);
            setName('');
        } catch (error) {
            console.error(error);
            toast({
                title: 'Upload Failed',
                description: 'Failed to upload BoQ. Please check the CSV format.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Import Bill of Quantities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>BoQ Name</Label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Structural Works BoQ"
                    />
                    <p className="text-xs text-muted-foreground">Required CSV Columns: Item Code, Description, Unit, Quantity, Rate</p>
                </div>

                <div className="space-y-2">
                    <Label>CSV File</Label>
                    <Input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </div>

                <Button className="w-full" onClick={handleUpload} disabled={!file || !name || loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Upload BoQ
                </Button>
            </CardContent>
        </Card>
    );
}
