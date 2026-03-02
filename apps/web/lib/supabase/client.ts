'use client';

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        // Return a dummy client or handle gracefully during build/SSR if envs are missing
        console.warn('Supabase env variables are missing');
        return createBrowserClient('https://placeholder.supabase.co', 'placeholder');
    }

    return createBrowserClient(url, key);
}
