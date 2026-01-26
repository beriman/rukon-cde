'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

interface Organization {
    id: string;
    name: string;
    slug: string;
    role: string;
}

interface OrganizationContextType {
    organizations: Organization[];
    currentOrg: Organization | null;
    isLoading: boolean;
    setCurrentOrg: (org: Organization) => void;
    refreshOrganizations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const token = useAuthStore((state) => state.token);

    const fetchOrganizations = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get('/organizations');
            const orgs = response.data;
            setOrganizations(orgs);

            // Auto-select first org if none selected but available
            if (orgs.length > 0 && !currentOrg) {
                // Check local storage
                const savedOrgId = localStorage.getItem('currentOrgId');
                const found = orgs.find((o: Organization) => o.id === savedOrgId);
                if (found) {
                    setCurrentOrg(found);
                } else {
                    setCurrentOrg(orgs[0]);
                    localStorage.setItem('currentOrgId', orgs[0].id);
                }
            }
        } catch (error) {
            console.error('Failed to fetch organizations', error);
            // If 401, AuthProvider should handle redirect
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrganizations();
        } else {
            setIsLoading(false);
        }
    }, [token]);

    const handleSetCurrentOrg = (org: Organization) => {
        setCurrentOrg(org);
        localStorage.setItem('currentOrgId', org.id);
    };

    return (
        <OrganizationContext.Provider value={{
            organizations,
            currentOrg,
            isLoading,
            setCurrentOrg: handleSetCurrentOrg,
            refreshOrganizations: fetchOrganizations
        }}>
            {children}
        </OrganizationContext.Provider>
    );
}

export function useOrganization() {
    const context = useContext(OrganizationContext);
    if (context === undefined) {
        throw new Error('useOrganization must be used within an OrganizationProvider');
    }
    return context;
}
