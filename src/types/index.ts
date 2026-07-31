// src/types/index.ts

// Generic API Response Wrapper matching your backend's CONSTANT format
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// Pagination Wrapper matching your mongoose-paginate plugin
export interface PaginatedData<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  totalCollectionCount: number; 
}

// User Entity
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerificationStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

// Book Entity
export type BookStatus = 'Want to Read' | 'Reading' | 'Completed';

export interface Book {
  id: string;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
}