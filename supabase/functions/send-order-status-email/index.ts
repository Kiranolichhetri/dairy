import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderStatusEmailRequest {
  orderId: string;
  newStatus: string;
  customerEmail: string;
  customerName: string;
  orderNumber: string;
}

const statusMessages: Record<string, { title: string; message: string; color: string }> = {
  pending: {
    title: "Order Received",
    message: "We have received your order and it is being reviewed.",
    color: "#f59e0b"
  },
  confirmed: {
    title: "Order Confirmed",
    message: "Great news! Your order has been confirmed and is being prepared.",
    color: "#10b981"
  },
  processing: {
    title: "Order Processing",
    message: "Your order is now being processed and prepared for shipping.",
    color: "#3b82f6"
  },
  shipped: {
    title: "Order Shipped",
    message: "Your order has been shipped and is on its way to you!",
    color: "#8b5cf6"
  },
  out_for_delivery: {
    title: "Out for Delivery",
    message: "Exciting news! Your order is out for delivery and will arrive soon.",
    color: "#06b6d4"
  },
  delivered: {
    title: "Order Delivered",
    message: "Your order has been delivered. Enjoy your products!",
    color: "#22c55e"
  },
  cancelled: {
    title: "Order Cancelled",
    message: "Your order has been cancelled. If you have any questions, please contact us.",
    color: "#ef4444"
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, newStatus, customerEmail, customerName, orderNumber }: OrderStatusEmailRequest = await req.json();

    // Prepare recipients: always send to customer, and if new order (pending), also to admin
    const recipients = [customerEmail];
    const adminEmail = "kiranoli421@gmail.com";
    if (newStatus === "pending") {
      recipients.push(adminEmail);
    }

    console.log(`Sending order status email for order ${orderNumber} to ${recipients.join(", ")}`);

    const statusInfo = statusMessages[newStatus] || {
      title: "Order Update",
      message: "There has been an update to your order.",
      color: "#6b7280"
    };

    const emailResponse = await resend.emails.send({
      from: "KHAIRAWANG DAIRY <onboarding@resend.dev>",
      to: recipients,
      subject: `${statusInfo.title} - Order #${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">KHAIRAWANG DAIRY</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px;">Fresh Dairy, Delivered Fresh</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px;">
                <h2 style="color: #1f2937; margin: 0 0 10px; font-size: 24px;">${statusInfo.title}</h2>
                <p style="color: #6b7280; margin: 0 0 30px; font-size: 16px;">Hello ${customerName},</p>
                
                <div style="background-color: #f3f4f6; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                  <div style="display: flex; align-items: center; margin-bottom: 16px;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${statusInfo.color}; margin-right: 12px;"></div>
                    <span style="font-weight: 600; color: #1f2937; font-size: 16px;">${statusInfo.title}</span>
                  </div>
                  <p style="color: #4b5563; margin: 0; font-size: 15px; line-height: 1.6;">${statusInfo.message}</p>
                </div>

                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                  <tr>
                    <td style="padding: 16px;">
                      <p style="color: #6b7280; margin: 0 0 8px; font-size: 14px;">Order Number</p>
                      <p style="color: #1f2937; margin: 0; font-size: 18px; font-weight: 600;">#${orderNumber}</p>
                    </td>
                  </tr>
                </table>

                <div style="text-align: center; margin-top: 30px;">
                  <a href="${Deno.env.get("SITE_URL") || "https://khairawang-dairy.lovable.app"}/order-tracking" 
                     style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Track Your Order
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px; background-color: #f9fafb; text-align: center;">
                <p style="color: #9ca3af; margin: 0 0 10px; font-size: 14px;">Thank you for choosing KHAIRAWANG DAIRY!</p>
                <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                  If you have any questions, please contact us at support@khairawangdairy.com
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-status-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
