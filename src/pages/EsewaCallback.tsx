import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const EsewaCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failure'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      // Get the encoded response from URL
      const encodedResponse = searchParams.get('data');
      
      if (!encodedResponse) {
        setStatus('failure');
        setMessage('No payment data received');
        return;
      }

      try {
        // Decode the response to get transaction details
        const decodedString = atob(encodedResponse);
        const responseData = JSON.parse(decodedString);
        
        console.log('eSewa callback data:', responseData);

        // Verify the payment
        const { data, error } = await supabase.functions.invoke('esewa-payment', {
          body: {
            action: 'verify',
            transactionUuid: responseData.transaction_uuid,
            totalAmount: responseData.total_amount,
            encodedResponse: encodedResponse,
          }
        });

        if (error) {
          throw error;
        }

        if (data.success) {
          setStatus('success');
          setMessage('Payment successful! Your order has been confirmed.');
          setPaymentSuccess(true);
        } else {
          setStatus('failure');
          setMessage(`Payment ${data.status || 'failed'}. Please try again.`);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failure');
        setMessage('Failed to verify payment. Please contact support.');
      }
    };

    verifyPayment();
  }, [searchParams]);

  useEffect(() => {
    // After payment verification and a short delay
    if (paymentSuccess) {
      setTimeout(() => {
        navigate('/order-confirmation'); // or your desired route
      }, 2000); // 2 seconds delay for user to read the message
    }
  }, [paymentSuccess, navigate]);

  return (
    <Layout showFooter={false}>
      <div className="bg-cream min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl border border-border p-8 text-center"
          >
            {status === 'loading' && (
              <>
                <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
                <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                  Processing Payment
                </h1>
                <p className="text-muted-foreground">{message}</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                  Payment Successful!
                </h1>
                <p className="text-muted-foreground mb-6">{message}</p>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => navigate('/order-tracking')}
                  className="w-full"
                >
                  Track Your Order
                </Button>
              </>
            )}

            {status === 'failure' && (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                  Payment Failed
                </h1>
                <p className="text-muted-foreground mb-6">{message}</p>
                <div className="space-y-3">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => navigate('/checkout')}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/products')}
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default EsewaCallback;
