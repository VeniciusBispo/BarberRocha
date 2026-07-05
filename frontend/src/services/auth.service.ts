import client from '../api/client';
import type { LoginData, RegisterData } from '../types/auth';

export class AuthService {
  public static async login(data: LoginData) {
    const response = await client.post('/auth/login', data);
    return response.data;
  }

  public static async register(data: RegisterData) {
    const response = await client.post('/auth/register', data);
    return response.data;
  }

  public static async changePassword(newPassword: string) {
    const response = await client.patch('/auth/change-password', { newPassword });
    return response.data;
  }
}
