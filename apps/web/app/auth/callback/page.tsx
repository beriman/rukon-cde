'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const handleCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session) {
                console.error('Auth Error:', error);
                router.push('/auth?error=auth_failed');
                return;
            }

            try {
                // Sync with NestJS Backend
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-sync`, {
                    accessToken: session.provider_token,
                });

                // Store our local JWT (Rukon Token)
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Redirect to dashboard
                router.push('/dashboard');
            } catch (syncError) {
                console.error('Sync Error:', syncError);
                router.push('/auth?error=sync_failed');
            }
        };

        handleCallback();
    }, [router, supabase.auth]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center max-w-xs w-full">
                <Loader2 className="w-10 h-10 text-slate-900 animate-spin mb-6" />
                <h2 className="text-xl font-bold text-slate-900 mb-2">Finalizing Sign In</h2>
                <p className="text-sm text-slate-400 font-light">
                    Syncing your profile with Rukon Workspace...
                </p>
            </div>
        </div>
    );
}
