import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// eSewa Sandbox Configuration
const ESEWA_CONFIG = {
  sandbox: {
    paymentUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
    verifyUrl: 'https://rc.esewa.com.np/api/epay/transaction/status/',
    secretKey: '8gBm/:&EnhH.1/q',
    productCode: 'EPAYTEST',
  },
  production: {
    paymentUrl: 'https://epay.esewa.com.np/api/epay/main/v2/form',
    verifyUrl: 'https://esewa.com.np/api/epay/transaction/status/',
    secretKey: '', // Will be set from env
    productCode: '', // Will be set from env
  }
};

// Use sandbox for testing
const config = ESEWA_CONFIG.sandbox;

async function generateSignature(message: string, secretKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  // Convert ArrayBuffer to base64
  const bytes = new Uint8Array(signature);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, ...data } = await req.json();

    if (action === 'initiate') {
      // Initiate payment - generate signature and return form data
      const { orderId, amount, taxAmount = 0, productServiceCharge = 0, productDeliveryCharge = 0 } = data;
      
      const totalAmount = amount + taxAmount + productServiceCharge + productDeliveryCharge;
      const transactionUuid = `${orderId}-${Date.now()}`;
      
      // Generate signature
      // Message format: total_amount=X,transaction_uuid=Y,product_code=Z
      const signatureMessage = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${config.productCode}`;
      const signature = await generateSignature(signatureMessage, config.secretKey);

      console.log('eSewa Payment Initiation:', {
        orderId,
        amount,
        totalAmount,
        transactionUuid,
        signatureMessage,
      });

      const formData = {
        amount: amount.toString(),
        tax_amount: taxAmount.toString(),
        total_amount: totalAmount.toString(),
        transaction_uuid: transactionUuid,
        product_code: config.productCode,
        product_service_charge: productServiceCharge.toString(),
        product_delivery_charge: productDeliveryCharge.toString(),
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature: signature,
        payment_url: config.paymentUrl,
      };

      // Store transaction in database for verification later
      const { error: insertError } = await supabaseClient
        .from('esewa_transactions')
        .insert({
          order_id: orderId,
          transaction_uuid: transactionUuid,
          amount: amount,
          total_amount: totalAmount,
          status: 'INITIATED',
        });

      if (insertError) {
        console.error('Error storing transaction:', insertError);
        // Continue anyway - we can still process the payment
      }

      return new Response(
        JSON.stringify({ success: true, data: formData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'verify') {
      // Verify payment status
      const { transactionUuid, totalAmount, encodedResponse } = data;

      // Decode and parse the response from eSewa
      let responseData;
      if (encodedResponse) {
        try {
          const decodedString = atob(encodedResponse);
          responseData = JSON.parse(decodedString);
          console.log('Decoded eSewa response:', responseData);
        } catch (e) {
          console.error('Failed to decode eSewa response:', e);
        }
      }

      // Verify the transaction status with eSewa API
      const verifyUrl = `${config.verifyUrl}?product_code=${config.productCode}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;
      
      console.log('Verifying transaction at:', verifyUrl);

      const verifyResponse = await fetch(verifyUrl);
      const verifyData = await verifyResponse.json();

      console.log('eSewa verification response:', verifyData);

      // Update transaction status in database
      const { error: updateError } = await supabaseClient
        .from('esewa_transactions')
        .update({
          status: verifyData.status,
          ref_id: verifyData.ref_id,
          verified_at: new Date().toISOString(),
        })
        .eq('transaction_uuid', transactionUuid);

      if (updateError) {
        console.error('Error updating transaction:', updateError);
      }

      // If payment is complete, update the order status
      if (verifyData.status === 'COMPLETE') {
        // Get the order ID from transaction
        const { data: txnData } = await supabaseClient
          .from('esewa_transactions')
          .select('order_id')
          .eq('transaction_uuid', transactionUuid)
          .single();

        if (txnData?.order_id) {
          // Update order status to confirmed
          const { error: orderError } = await supabaseClient
            .from('orders')
            .update({ 
              status: 'confirmed',
              payment_method: 'esewa',
            })
            .eq('id', txnData.order_id);

          if (orderError) {
            console.error('Error updating order:', orderError);
          }
        }
      }

      return new Response(
        JSON.stringify({ 
          success: verifyData.status === 'COMPLETE',
          status: verifyData.status,
          data: verifyData 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('eSewa payment error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
