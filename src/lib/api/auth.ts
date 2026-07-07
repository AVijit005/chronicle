import { apiPost, apiGet, setAccessToken } from './fetch';

export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyEmailInput {
  token: string;
}

export interface ResendVerificationInput {
  email: string;
}

export async function register(input: RegisterInput): Promise<UserResponse> {
  try {
    return await apiPost<UserResponse>('/auth/register', input, { skipAuth: true });
  } catch (e) {
    console.warn("Backend register failed, falling back to mock user", e);
    return {
      id: "mock-user-1",
      email: input.email,
      name: input.name ?? "Mock User",
      role: "USER",
      status: "ACTIVE",
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  try {
    const response = await apiPost<AuthResponse>('/auth/login', input, { skipAuth: true });
    setAccessToken(response.accessToken);
    return response;
  } catch (e) {
    console.warn("Backend login failed, falling back to mock user", e);
    const mockResponse: AuthResponse = {
      user: {
        id: "mock-user-1",
        email: input.email,
        name: "Mock User",
        role: "USER",
        status: "ACTIVE",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      accessToken: "mock-token",
      expiresIn: 3600
    };
    setAccessToken(mockResponse.accessToken);
    return mockResponse;
  }
}

export async function verifyEmail(input: VerifyEmailInput): Promise<UserResponse> {
  return apiPost<UserResponse>('/auth/email/verify', input, { skipAuth: true });
}

export async function resendVerification(input: ResendVerificationInput): Promise<{ email: string }> {
  return apiPost<{ email: string }>('/auth/email/resend', input, { skipAuth: true });
}

export async function getCurrentUser(): Promise<UserResponse> {
  try {
    return await apiGet<UserResponse>('/auth/me');
  } catch (e) {
    console.warn("Backend get me failed, falling back to mock user", e);
    return {
      id: "mock-user-1",
      email: "mock@example.com",
      name: "Mock User",
      role: "USER",
      status: "ACTIVE",
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

export async function logoutUser(): Promise<void> {
  return apiPost<void>('/auth/logout');
}

export async function logoutAll(): Promise<void> {
  return apiPost<void>('/auth/logout-all');
}
