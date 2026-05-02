'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

function AuthCallbackContent() {
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
                // Prepare sync payload
                const syncPayload: any = {
                    email: session.user.email,
                    name: session.user.user_metadata.full_name || session.user.email,
                };

                // If it's a Google login, pass the provider token for server-side verification
                // to prevent Confused Deputy / account takeover attacks.
                if (session.user.app_metadata?.provider === 'google' && session.provider_token) {
                    syncPayload.providerToken = session.provider_token;
                    syncPayload.provider = 'google';
                }

                // Sync with NestJS Backend
                // We use google-sync as our primary OAuth sync endpoint.
                // Only enforce providerToken if we are actually doing Google auth to avoid breaking other flows.
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-sync`, syncPayload);

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
    }, [router, supabase]);

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

export default function AuthCallback() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
