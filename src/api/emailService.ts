// services/emailService.ts

interface OrderEmailData {
    name_ed: string;
    email: string;
    name_stu: string;
    school: string;
    class: string;
    packs: string[];
    extras: string[];
    observation: string;
    totalCost: number;
  }
  
  export const sendOrderConfirmationEmail = async (orderData: OrderEmailData) => {
    try {
      const response = await fetch('https://directus.fcpro-school.com/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_DIRECTUS_TOKEN`
        },
        body: JSON.stringify({
          to: orderData.email,
          subject: 'Order Confirmation',
          template: 'order-confirmation',
          data: {
            orderData,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
          }
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }
  };