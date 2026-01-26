'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { OrganizationProvider } from './OrganizationProvider';

// Create a client
const queryClient = new QueryClient();

export function MainProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <OrganizationProvider>
                {children}
                <Toaster />
            </OrganizationProvider>
        </QueryClientProvider>
    );
}
