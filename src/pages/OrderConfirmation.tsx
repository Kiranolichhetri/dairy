import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
        <p className="mb-6 text-lg text-muted-foreground">Your payment was successful and your order has been placed.</p>
        <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
