-- Create esewa_transactions table to track eSewa payments
CREATE TABLE public.esewa_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id),
  transaction_uuid TEXT NOT NULL UNIQUE,
  amount NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'INITIATED',
  ref_id TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.esewa_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies - allow authenticated users to view their own transactions
CREATE POLICY "Users can view their own esewa transactions" 
ON public.esewa_transactions 
FOR SELECT 
USING (
  order_id IN (
    SELECT id FROM public.orders WHERE user_id = auth.uid()
  )
);

-- Allow service role to manage all transactions (for edge functions)
CREATE POLICY "Service role can manage esewa transactions" 
ON public.esewa_transactions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_esewa_transactions_updated_at
BEFORE UPDATE ON public.esewa_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();