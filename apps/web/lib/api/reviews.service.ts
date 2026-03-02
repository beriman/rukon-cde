import { apiClient } from '../api-client';
export enum SubmittalStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    UNDER_REVIEW = 'UNDER_REVIEW',
    APPROVED = 'APPROVED',
    APPROVED_WITH_NOTES = 'APPROVED_WITH_NOTES',
    REJECTED = 'REJECTED',
    RESUBMITTED = 'RESUBMITTED'
}

export interface Submittal {
    id: string;
    projectId: string;
    referenceNumber: string;
    title: string;
    fileId: string;
    status: SubmittalStatus;
    currentStageIndex: number;
    activeApprovers: string[];
    submittedBy: string;
    createdAt: string;
    file: {
        name: string;
        cdeState: string;
        currentVersion: number;
    };
    submitter: {
        name: string;
        email: string;
    };
}

export const reviewsService = {
    async getPendingReviews(projectId: string): Promise<Submittal[]> {
        const { data } = await apiClient.get(`/construction/submittals?projectId=${projectId}`);
        return data;
    },

    async initiateReview(fileId: string, workflowId: string) {
        const { data } = await apiClient.post(`/files/${fileId}/review/initiate`, { workflowId });
        return data;
    },

    async processReviewStep(submittalId: string, status: 'APPROVED' | 'REJECTED' | 'APPROVED_WITH_NOTES', comments?: string) {
        const { data } = await apiClient.post(`/files/reviews/${submittalId}/process`, { status, comments });
        return data;
    },

    async getAllSubmittalsByProject(projectId: string): Promise<Submittal[]> {
        const { data } = await apiClient.get(`/construction/submittals?projectId=${projectId}`);
        return data;
    }
};
