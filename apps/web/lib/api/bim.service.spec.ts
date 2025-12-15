import { describe, it, expect, vi } from 'vitest';
import { bimService } from './bim.service';
import { apiClient } from '@/lib/api-client';

vi.mock('@/lib/api-client', () => ({
    apiClient: {
        get: vi.fn(),
    },
}));

describe('bimService', () => {
    it('getAccessToken should call API correctly', async () => {
        const mockResponse = { data: { token: 't', url: 'u', expires: 100 } };
        (apiClient.get as any).mockResolvedValue(mockResponse);

        const result = await bimService.getAccessToken('p1', 'f1');

        expect(apiClient.get).toHaveBeenCalledWith('/projects/p1/bim/models/f1/access-token');
        expect(result).toEqual(mockResponse.data);
    });
});
