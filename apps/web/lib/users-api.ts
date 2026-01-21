import { apiClient } from './api-client';

export type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
};

export type InviteUserPayload = {
  email: string;
  role: string;
  organizationId: string;
};

export const inviteUser = async (payload: InviteUserPayload): Promise<User> => {
  const response = await apiClient.post<User>('/users/invite', payload);
  return response.data;
};
