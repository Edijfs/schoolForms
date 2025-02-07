// types/models.ts

export interface ContactFormData {
  name_ed: string;
  email: string;
}

export interface StudentFormData {
  name_stu: string;
  turma: string;
}

export interface OrderFormData {
  packs: string[];
  extras: string[];
  obs: string;
  total_enc: number;
}

export interface OrderData {
  nome_ed: string;   
  nome_stu: string;  
  email: string;
  escola: string;
  turma: string;
  packs: string[];
  extras: string[];
  obs: string;
  total_enc: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Extra {
  extra: string;
  description: string;
  price: number;
}

export interface DirectusResponse<T> {
  data: T;
  meta?: {
    filter_count?: number;
    total_count?: number;
  };
}

export interface SchoolContextType {
  schoolName: string | null;
}

export interface OrderFormProps {
  onSubmit: (data: OrderFormData) => Promise<void>;
}

export interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
}

export interface StudentFormProps {
  onSubmit: (data: StudentFormData) => void;
}

export interface OrderState {
  currentForm: 'contact' | 'student' | 'order';
  orderData: Partial<OrderData>;
}

export type FormStep = 'contact' | 'student' | 'order';

export interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}