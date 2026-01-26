'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface UploadWizardProps {
    projectId: string;
    projectCode: string;
    folderId?: string;
}

// ISO 19650 Naming Standard Dictionaries
// Project-Originator-Volume-Level-Type-Role-Number
const DICTIONARIES = {
    originators: [
        { code: 'WIK', label: 'Wijaya Karya (WIK)' },
        { code: 'ABC', label: 'ABC Consultants (ABC)' },
        { code: 'OWN', label: 'Owner (OWN)' },
    ],
    volumes: [
        { code: 'ZZ', label: 'All Volumes (ZZ)' },
        { code: '01', label: 'Building 01 (01)' },
        { code: '02', label: 'Building 02 (02)' },
    ],
    levels: [
        { code: 'ZZ', label: 'All Levels (ZZ)' },
        { code: '00', label: 'Ground Floor (00)' },
        { code: '01', label: 'Level 1 (01)' },
        { code: 'RF', label: 'Roof (RF)' },
    ],
    types: [
        { code: 'M3', label: '3D Model (M3)' },
        { code: 'DR', label: '2D Drawing (DR)' },
        { code: 'RP', label: 'Report (RP)' },
        { code: 'BQ', label: 'Bill of Quantities (BQ)' },
    ],
    roles: [
        { code: 'A', label: 'Architect (A)' },
        { code: 'S', label: 'Structural (S)' },
        { code: 'M', label: 'Mechanical (M)' },
        { code: 'E', label: 'Electrical (E)' },
        { code: 'C', label: 'Civil (C)' },
        { code: 'Z', label: 'General / All (Z)' },
    ]
};

export function UploadWizard({ projectId, projectCode, folderId }: UploadWizardProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Naming Parts
    const [originator, setOriginator] = useState('');
    const [volume, setVolume] = useState('ZZ');
    const [level, setLevel] = useState('ZZ');
    const [type, setType] = useState('M3');
    const [role, setRole] = useState('A');
    const [number, setNumber] = useState('0001');

    // Generated Name
    const generatedName = `${projectCode}-${originator}-${volume}-${level}-${type}-${role}-${number}`;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        if (!file || !folderId) {
            toast.error('Missing file or upload folder (WIP)');
            return;
        }

        setIsUploading(true);

        // Create a new File with the ISO name
        const fileExtension = file.name.split('.').pop();
        const isoFileName = `${generatedName}.${fileExtension}`;
        const renamedFile = new File([file], isoFileName, { type: file.type });

        const formData = new FormData();
        formData.append('file', renamedFile);
        formData.append('folderId', folderId);

        try {
            await apiClient.post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success(`Successfully uploaded ${isoFileName}`);
            setTimeout(() => {
                setOpen(false);
                setStep(1);
                setFile(null);
                setIsUploading(false);
            }, 1000);

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Upload failed. Check format!');
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Upload File (ISO 19650)</DialogTitle>
                    <DialogDescription>
                        {folderId ? 'Uploading to: WIP Container' : 'Loading folder context...'}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {/* Steps Indicator */}
                    <div className="flex items-center justify-between mb-6 px-2">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`flex items-center ${s < 3 ? 'flex-1' : ''}`}>
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold
                            ${step === s ? 'border-primary bg-primary text-primary-foreground' :
                                        step > s ? 'border-primary bg-primary text-primary-foreground' : 'border-slate-200 text-slate-400'}
                         `}>
                                    {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                                </div>
                                {s < 3 && <div className={`h-1 flex-1 mx-2 rounded-full ${step > s ? 'bg-primary' : 'bg-slate-100'}`} />}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: File Selection */}
                    {step === 1 && (
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="file">Select Document / Model</Label>
                            <Input id="file" type="file" onChange={handleFileChange} />
                            {file && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-lg flex items-center gap-3">
                                    <FileText className="h-8 w-8 text-blue-500" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{file.name}</p>
                                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: ISO Naming */}
                    {step === 2 && (
                        <div className="grid gap-4">
                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-center">
                                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Preview Filename</span>
                                <div className="text-lg font-mono font-bold text-slate-800 mt-1">
                                    {generatedName}.{file?.name.split('.').pop()}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Originator</Label>
                                    <Select value={originator} onValueChange={setOriginator}>
                                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            {DICTIONARIES.originators.map(o => <SelectItem key={o.code} value={o.code}>{o.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Volume / Zone</Label>
                                    <Select value={volume} onValueChange={setVolume}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {DICTIONARIES.volumes.map(o => <SelectItem key={o.code} value={o.code}>{o.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Level</Label>
                                    <Select value={level} onValueChange={setLevel}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {DICTIONARIES.levels.map(o => <SelectItem key={o.code} value={o.code}>{o.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>File Type</Label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {DICTIONARIES.types.map(o => <SelectItem key={o.code} value={o.code}>{o.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Role (Discipline)</Label>
                                    <Select value={role} onValueChange={setRole}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {DICTIONARIES.roles.map(o => <SelectItem key={o.code} value={o.code}>{o.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Number (Sequence)</Label>
                                    <Input
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                        maxLength={6}
                                        className="font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                                <div className="flex flex-col space-y-1.5">
                                    <h3 className="font-semibold leading-none tracking-tight">Ready to Upload</h3>
                                    <p className="text-sm text-muted-foreground">Please review the details below.</p>
                                </div>
                                <div className="p-4 mt-4 bg-slate-50 rounded-md space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Original File:</span>
                                        <span className="font-medium text-slate-800 max-w-[200px] truncate">{file?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">ISO Name:</span>
                                        <span className="font-mono font-bold text-blue-600">{generatedName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Target Folder:</span>
                                        <span className="font-medium text-slate-800">{foldersId ? 'WIP' : 'Unknown'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {step > 1 && (
                        <Button variant="outline" onClick={handleBack} type="button" disabled={isUploading}>Back</Button>
                    )}

                    {step < 3 ? (
                        <Button onClick={handleNext} disabled={step === 1 && !file}>Next</Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isUploading || !folderId}>
                            {isUploading ? 'Uploading...' : 'Confirm Upload'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
