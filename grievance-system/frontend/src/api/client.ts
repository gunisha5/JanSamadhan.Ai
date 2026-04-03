import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export type Role = 'CITIZEN' | 'ADMIN';

export interface AuthResponse {
  token: string;
  name?: string;
  email: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  otp: string;
}

export interface ComplaintRequest {
  description: string;
}

export interface UpdateStatusRequest {
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
  remarks: string;
}

export interface DepartmentRequest {
  name: string;
  description?: string;
}

export interface Complaint {
  id: number;
  description: string;
  category?: string;
  priority?: string;
  status: string;
  user?: { id: number; name: string; email: string };
  department?: { id: number; name: string } | null;
  createdAt?: string;
  resolvedAt?: string | null;
}

export interface ComplaintHistory {
  id: number;
  status: string;
  remarks: string;
  updatedAt: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string | null;
}

export const authApi = {
  async sendOtp(email: string) {
    await api.post('/auth/send-otp', { email });
  },
  async login(payload: LoginRequest) {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },
  async register(payload: RegisterRequest) {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },
};

export const complaintApi = {
  async submit(payload: ComplaintRequest) {
    const { data } = await api.post<Complaint>('/complaints', payload);
    return data;
  },
  async listMine() {
    const { data } = await api.get<Complaint[]>('/complaints');
    return data;
  },
  async listAll() {
    const { data } = await api.get<Complaint[]>('/complaints/all');
    return data;
  },
  async history(id: number) {
    const { data } = await api.get<ComplaintHistory[]>(`/complaints/${id}/status`);
    return data;
  },
  async updateStatus(id: number, payload: UpdateStatusRequest) {
    const { data } = await api.put<Complaint>(`/complaints/${id}/status`, payload);
    return data;
  },
};

export const departmentApi = {
  async list() {
    const { data } = await api.get<Department[]>('/departments');
    return data;
  },
  async create(payload: DepartmentRequest) {
    const { data } = await api.post<Department>('/departments', payload);
    return data;
  },
};
