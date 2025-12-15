import { apiClient } from '@/lib/api-client';

export interface BimAccessToken {
    token: string;
    url: string;
    expires: number;
}

export const bimService = {
    getAccessToken: async (projectId: string, fileId: string): Promise<BimAccessToken> => {
        const response = await apiClient.get<BimAccessToken>(
            `/projects/${projectId}/bim/models/${fileId}/access-token`
        );
        return response.data;
    },
};
