// src/services/api.ts
import api from '@/lib/axios';
import { ApiResponse, PaginatedData, Book, User } from '@/types';

// --- AUTH SERVICES ---
export const authService = {
  login: async (credentials: Record<string, string>): Promise<ApiResponse<{ user: User }>> => {
    const { data } = await api.post<ApiResponse<{ user: User }>>('/user/auth/login', credentials);
    return data;
  },
  
  register: async (userData: Record<string, string>): Promise<ApiResponse<User>> => {
    const { data } = await api.post<ApiResponse<User>>('/user/auth/register', userData);
    return data;
  },
  
  logout: async (): Promise<ApiResponse> => {
    const { data } = await api.post<ApiResponse>('/user/auth/logout');
    return data;
  },
  getUserProfile: async (): Promise<ApiResponse<User>> => {
    const { data } = await api.get<ApiResponse<User>>(`/usersdata/profile`);
    return data;
  }
};



// --- BOOK SERVICES ---
export interface GetBooksParams {
  page?: number;
  limit?: number;
  status?: string;
  tag?: string;
  sortBy?: string;
}

export const bookService = {
  getBooks: async (params?: GetBooksParams): Promise<ApiResponse<PaginatedData<Book>>> => {
    const { data } = await api.get<ApiResponse<PaginatedData<Book>>>('/books', { params });
    return data;
  },

  createBook: async (bookData: Partial<Book>): Promise<ApiResponse<Book>> => {
    const { data } = await api.post<ApiResponse<Book>>('/books', bookData);
    return data;
  },

  updateBook: async (bookId: string, bookData: Partial<Book>): Promise<ApiResponse<Book>> => {
    const { data } = await api.patch<ApiResponse<Book>>(`/books/${bookId}`, bookData);
    return data;
  },

  deleteBook: async (bookId: string): Promise<ApiResponse> => {
    const { data } = await api.delete<ApiResponse>(`/books/${bookId}`);
    return data;
  }
};