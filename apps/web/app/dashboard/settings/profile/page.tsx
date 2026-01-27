'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SignaturePad } from '@/components/ui/signature-pad';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2, Save, User as UserIcon } from 'lucide-react';
import Image from 'next/image';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    signatureUrl?: string;
}

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [newSignature, setNewSignature] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // Assuming we have an endpoint to get 'me' details including signature
            // If users/me/dashboard doesn't return signature, we might need a specific endpoint or update logic
            // But let's assume getDashboardData or findOneById returns it.
            // Actually, we should probably fetch via ID if 'me' endpoint isn't robust.
            // But we don't have user ID in context easily without auth store.
            // Let's rely on /users/me/dashboard getting basics or create a /users/me endpoint?
            // UsersController has @Get('me/dashboard').
            // And @Get(':id').
            // We can decode token or just assume we have the ID.
            // For now, let's try to fetch /users/me/dashboard and see if it returns user object primarily?
            // No, it returns dashboard data.
            // We need a /users/me endpoint or similar.
            // But simpler: just mock for now OR use the list endpoint with email search?
            // Wait, we have an auth store with user info?
            // Using `apiClient` assumes token is attached.
            // Let's call a new endpoint I should assume exists or create one?
            // I'll create a Get('me/profile') in UsersController later if needed.
            // For now, I'll use a mocked user fetch or try to get by ID if I knew it.
            // The AuthStore usually has the user.

            // Temporary: We will use a direct call to get user info if we assume we saved ID in localStorage or AuthStore
            // But I can't access AuthStore hooks easily outside component? 
            // Wait, I am in a component!

            // Retrieve user from API (assuming we can get /users/me or similar)
            // Let's implement /users/me/profile in backend quickly? 
            // Or just use the dashboard data if it included user info?
            // Dashboard data doesn't include profile info (Step 790).

            // So I should add `getProfile` to UsersService/Controller.
            // I will do that in the next step.
            // For now, write the frontend assuming the endpoint exists: /users/me/profile
            const res = await apiClient.get('/users/me/profile');
            setUser(res.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
            // toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSignature = async () => {
        if (!newSignature) return;
        setSaving(true);
        try {
            // Convert base64 to blob
            const base64Response = await fetch(newSignature);
            const blob = await base64Response.blob();

            const formData = new FormData();
            formData.append('file', blob, 'signature.png');

            await apiClient.post('/users/me/signature', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Signature updated successfully');
            fetchProfile(); // Refresh
            setNewSignature(null);
        } catch (error) {
            console.error('Failed to save signature', error);
            toast.error('Failed to save signature');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-medium text-slate-800 tracking-tight mb-1">Profile</h1>
                <p className="text-sm text-slate-500 font-light">Manage your personal information and signature</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Personal Info Card */}
                <Card className="md:col-span-2 shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                            <UserIcon className="w-5 h-5 text-slate-500" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={user?.name || ''} disabled className="bg-slate-50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={user?.email || ''} disabled className="bg-slate-50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input id="role" value={user?.role || ''} disabled className="bg-slate-50" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Signature Card */}
                <Card className="md:col-span-1 shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Digital Signature</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {user?.signatureUrl ? (
                            <div className="border rounded-lg p-4 bg-slate-50 flex flex-col items-center">
                                <div className="relative w-full h-32 mb-2">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/files/${user.signatureUrl}`}
                                        alt="Current Signature"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <p className="text-xs text-slate-400">Current Signature</p>
                            </div>
                        ) : (
                            <div className="text-sm text-slate-500 text-center p-4 border border-dashed rounded-lg">
                                No signature uploaded
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Update Signature</Label>
                            <SignaturePad onChange={setNewSignature} />
                        </div>

                        {newSignature && (
                            <Button
                                onClick={handleSaveSignature}
                                disabled={saving}
                                className="w-full"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Signature
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
