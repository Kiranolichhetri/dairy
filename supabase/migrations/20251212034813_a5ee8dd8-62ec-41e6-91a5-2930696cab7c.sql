-- Make order_number have a default so the trigger can override it
ALTER TABLE public.orders ALTER COLUMN order_number SET DEFAULT '';