import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Product, Extra } from '../types/models';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both products and extras in parallel
      const [productsResponse, extrasResponse] = await Promise.all([
        apiService.getProducts(),
        apiService.getExtras()
      ]);

      // Access the data property from the Directus response
      setProducts(productsResponse.data || []);
      setExtras(extrasResponse.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err : new Error('Failed to load products'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    products,
    extras,
    loading,
    error,
    refetch: fetchData
  };
}