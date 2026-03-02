import { apiClient } from '../api-client';

export enum AssetStatus {
    ORDERED = 'ORDERED',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    INSTALLED = 'INSTALLED',
    COMMISSIONED = 'COMMISSIONED',
    MAINTENANCE = 'MAINTENANCE',
    DECOMMISSIONED = 'DECOMMISSIONED'
}

export interface Asset {
    id: string;
    projectId: string;
    name: string;
    category: string;
    tagNumber?: string;
    modelId?: string;
    elementGuid?: string;
    status: AssetStatus;
    location?: string;
    manufacturer?: string;
    modelNumber?: string;
    serialNumber?: string;
    purchaseDate?: string;
    warrantyExpiry?: string;
    metadata?: any;
}

export const assetService = {
    async getAssets(projectId: string): Promise<Asset[]> {
        const { data } = await apiClient.get(`/projects/${projectId}/assets`);
        return data;
    },

    async getAssetByGuid(projectId: string, guid: string): Promise<Asset | null> {
        const { data } = await apiClient.get(`/projects/${projectId}/assets/by-guid?guid=${guid}`);
        return data;
    },

    async createAsset(projectId: string, asset: Partial<Asset>): Promise<Asset> {
        const { data } = await apiClient.post(`/projects/${projectId}/assets`, asset);
        return data;
    },

    async updateAsset(projectId: string, id: string, asset: Partial<Asset>): Promise<Asset> {
        const { data } = await apiClient.patch(`/projects/${projectId}/assets/${id}`, asset);
        return data;
    }
};
