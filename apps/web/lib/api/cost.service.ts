import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface BoQItem {
    id: string;
    description: string;
    unit: string;
    quantity: number;
    unitRate: number;
    amount: number;
    itemCode?: string;
    actualQty?: number;
    mappings?: CostMapping[];
}

export interface BillOfQuantities {
    id: string;
    name: string;
    description?: string;
    currency: string;
    items?: BoQItem[];
}

export interface CostMapping {
    id: string;
    boqItemId: string;
    elementGuid: string;
    modelId: string;
    boqItem?: BoQItem;
}

export const costService = {
    async getBoqs(projectId: string): Promise<BillOfQuantities[]> {
        const response = await axios.get(`${API_URL}/projects/${projectId}/cost/boq`);
        return response.data;
    },

    async createBoq(projectId: string, data: { name: string; description?: string; currency?: string }) {
        const response = await axios.post(`${API_URL}/projects/${projectId}/cost/boq`, data);
        return response.data;
    },

    async createItem(projectId: string, boqId: string, data: Partial<BoQItem>) {
        const response = await axios.post(`${API_URL}/projects/${projectId}/cost/boq/${boqId}/items`, data);
        return response.data;
    },

    async getItems(projectId: string, boqId: string): Promise<BoQItem[]> {
        const response = await axios.get(`${API_URL}/projects/${projectId}/cost/boq/${boqId}/items`);
        return response.data;
    },

    async mapItem(projectId: string, boqItemId: string, elementGuid: string, modelId: string) {
        const response = await axios.post(`${API_URL}/projects/${projectId}/cost/map`, {
            boqItemId,
            elementGuid,
            modelId
        });
        return response.data;
    },

    async getMappings(projectId: string): Promise<CostMapping[]> {
        const response = await axios.get(`${API_URL}/projects/${projectId}/cost/mappings`);
        return response.data;
    }
};
