import api from '../../../services/api';
import type { AuthUser } from '../../../stores/authStore';

interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export const authApi = {
  login: (username: string, password: string): Promise<LoginResponse> =>
    api.post<LoginResponse>('/auth/login', { username, password }).then((r) => r.data),
};
