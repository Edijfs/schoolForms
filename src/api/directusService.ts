// api/directusService.ts
const DIRECTUS_URL = 'https://directus.fcpro-school.com';
const DIRECTUS_TOKEN = 'eHaHMPvM1EtoclQHZVBSvGCs2dlvWKYE'; 

interface OrderData {
  name_ed?: string;
  email?: string;
  name_stu?: string;
  escola?: string;
  turma?: string;
  packs?: string[];
  extras?: string[];
  obs?: string;
  total_enc?: number;

}

export const submitOrder = async (orderData: OrderData) => {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/encomendas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Directus API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Submit Order Error:', error);
    throw error;
  }
};