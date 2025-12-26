import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, MapPin, ChevronLeft, Check, Wallet } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder, loading } = useOrders();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [processingEsewa, setProcessingEsewa] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [formErrors, setFormErrors] = useState<{ email?: string; phone?: string }>({});

  if (items.length === 0) {
    navigate('/products');
    return null;
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error on change
    setFormErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const deliveryFee = total >= 500 ? 0 : 40;
  const grandTotal = total + deliveryFee;

  const handleEsewaPayment = async (orderId: string) => {
    setProcessingEsewa(true);
    try {
      // Get eSewa payment form data from edge function
      const { data, error } = await supabase.functions.invoke('esewa-payment', {
        body: {
          action: 'initiate',
          orderId: orderId,
          amount: grandTotal,
          taxAmount: 0,
          productServiceCharge: 0,
          productDeliveryCharge: deliveryFee,
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error('Failed to initiate payment');
      }

      // Create and submit the eSewa payment form
      const esewaData = data.data;
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = esewaData.payment_url;

      // Get the current URL for callbacks
      // Use production callback URLs for eSewa
      const successUrl = "https://khairawang-dairy.vercel.app/esewa/callback";
      const failureUrl = "https://khairawang-dairy.vercel.app/esewa/callback";

      const formFields = {
        amount: esewaData.amount,
        tax_amount: esewaData.tax_amount,
        total_amount: esewaData.total_amount,
        transaction_uuid: esewaData.transaction_uuid,
        product_code: esewaData.product_code,
        product_service_charge: esewaData.product_service_charge,
        product_delivery_charge: esewaData.product_delivery_charge,
        success_url: successUrl,
        failure_url: failureUrl,
        signed_field_names: esewaData.signed_field_names,
        signature: esewaData.signature,
      };

      Object.entries(formFields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('eSewa payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate eSewa payment. Please try again.",
        variant: "destructive",
      });
      setProcessingEsewa(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors: { email?: string; phone?: string } = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
      valid = false;
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Mobile number must be 10 digits.';
      valid = false;
    }
    setFormErrors(newErrors);
    if (!valid) return;

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to place an order.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    const orderItems = items.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    const order = await createOrder({
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      deliveryAddress: `${formData.street}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      items: orderItems,
      subtotal: total,
      shipping: deliveryFee,
      total: grandTotal,
      paymentMethod,
    });

    if (order) {
      if (paymentMethod === 'esewa') {
        // Redirect to eSewa for payment
        await handleEsewaPayment(order.id);
      } else {
        // COD - clear cart and go to tracking
        clearCart();
        navigate('/order-tracking');
      }
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="bg-cream min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Cart
          </Button>

          <h1 className="font-display text-3xl font-bold text-foreground mb-8">
            Checkout
          </h1>

          <form onSubmit={handleSubmit} ref={formRef}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Shipping & Payment */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Address */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-display font-semibold text-xl">Shipping Address</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        maxLength={10}
                        minLength={10}
                        pattern="\d{10}"
                      />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-display font-semibold text-xl">Payment Method</h2>
                  </div>

                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors bg-green-50 dark:bg-green-900/20">
                      <RadioGroupItem value="esewa" id="esewa" />
                      <Label htmlFor="esewa" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-700 dark:text-green-400">eSewa</span>
                          <span className="text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">Sandbox</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pay securely with eSewa digital wallet
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Test credentials: 9806800001 / Nepal@123
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </motion.div>
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:sticky lg:top-24 h-fit"
              >
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display font-semibold text-xl mb-4">Order Summary</h2>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × ₹{item.product.price}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          ₹{item.product.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className={deliveryFee === 0 ? 'text-primary' : ''}>
                        {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                      </span>
                    </div>
                    {deliveryFee > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Add ₹{500 - total} more for free delivery
                      </p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full mt-6"
                    disabled={loading || processingEsewa}
                  >
                    {loading || processingEsewa ? (
                      'Processing...'
                    ) : paymentMethod === 'esewa' ? (
                      <>
                        <Wallet className="w-5 h-5 mr-2" />
                        Pay with eSewa
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground justify-center">
                    <Truck className="w-4 h-4" />
                    <span>Estimated delivery: 1-2 business days</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;