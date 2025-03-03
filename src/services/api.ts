// services/api.ts
import { OrderData, DirectusResponse, Product, Extra } from '../types/models';

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private readonly baseUrl: string;
  private readonly apiToken: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_DIRECTUS_URL || 'https://directus.fcpro-school.com';
    this.apiToken = import.meta.env.VITE_DIRECTUS_TOKEN || 'eHaHMPvM1EtoclQHZVBSvGCs2dlvWKYE';

    if (!this.apiToken) {
      console.warn('API token not configured');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<DirectusResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiToken}`,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', {
          status: response.status,
          data: data
        });
        throw new ApiError(
          data.errors?.[0]?.message || 'API request failed',
          response.status,
          data.errors
        );
      }

      return data;
    } catch (error) {
      console.error('Request error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network request failed'
      );
    }
  }

  async getProducts(): Promise<DirectusResponse<Product[]>> {
    return this.request<Product[]>('/items/Products');
  }

  async getExtras(): Promise<DirectusResponse<Extra[]>> {
    return this.request<Extra[]>('/items/Extras');
  }

  async submitOrder(orderData: OrderData): Promise<DirectusResponse<OrderData>> {
    // Match field names exactly with Directus collection
    const transformedData = {
      name_ed: orderData.nome_ed,
      email: orderData.email,
      name_stu: orderData.nome_stu,
      escola: orderData.escola,
      turma: orderData.turma,
      packs: orderData.packs,
      extras: orderData.extras,
      total_enc: orderData.total_enc,
      obs: orderData.obs
    };

    console.log('Submitting order with data:', transformedData);

    return this.request<OrderData>('/items/encomendas', {
      method: 'POST',
      body: JSON.stringify(transformedData),
    });
  }

  async processOrder(orderData: OrderData): Promise<void> {
    try {
      await this.submitOrder(orderData);
    } catch (error) {
      console.error('Order processing error:', error);
      throw error instanceof ApiError 
        ? error 
        : new ApiError('Failed to process order');
    }
  }

  async sendOrderConfirmation(orderData: OrderData): Promise<DirectusResponse<void>> {
    return this.request<void>('/email/send', {
      method: 'POST',
      body: JSON.stringify({
        to: orderData.email,
        subject: 'Confirmação de Encomenda',
        template: 'order-confirmation',
        data: {
          orderData,
          date: new Date().toLocaleDateString('pt-PT'),
          time: new Date().toLocaleTimeString('pt-PT')
        }
      }),
    });
  }
}

export const apiService = new ApiService();
export default ApiService;