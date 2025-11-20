const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API call error:', error);
    return {
      success: false,
      message: 'An error occurred while making the API call',
    };
  }
}

// Product APIs
export const productApi = {
  getAll: (search = '') => apiCall<any[]>(`/api/products?search=${search}`),
  getById: (id: string) => apiCall<any>(`/api/products/${id}`),
  create: (data: any) => apiCall<any>('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall<any>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall<any>(`/api/products/${id}`, {
    method: 'DELETE',
  }),
};

// User APIs
export const userApi = {
  getAll: (search = '') => apiCall<any[]>(`/api/users?search=${search}`),
  getById: (id: string) => apiCall<any>(`/api/users/${id}`),
  create: (data: any) => apiCall<any>('/api/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiCall<any>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiCall<any>(`/api/users/${id}`, {
    method: 'DELETE',
  }),
};
