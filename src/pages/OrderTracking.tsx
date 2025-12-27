import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, Clock, Search, MapPin, Download, RefreshCw, Eye, FileText, CreditCard, Wallet, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { products } from "@/data/products";
import { supabase } from '@/integrations/supabase/client';
import { useOrders, Order, OrderItem } from "@/hooks/useOrders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PaymentStatus {
  status: string;
  ref_id: string | null;
  verified_at: string | null;
}

const statusConfig = {
  pending: { label: "Pending", color: "bg-gray-500", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-500", icon: CheckCircle },
  processing: { label: "Processing", color: "bg-yellow-500", icon: Clock },
  shipped: { label: "Shipped", color: "bg-indigo-500", icon: Package },
  out_for_delivery: { label: "Out for Delivery", color: "bg-purple-500", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-500", icon: XCircle },
};

const paymentStatusConfig = {
  INITIATED: { label: "Payment Initiated", color: "bg-yellow-500", icon: Clock },
  PENDING: { label: "Payment Pending", color: "bg-orange-500", icon: AlertCircle },
  COMPLETE: { label: "Payment Complete", color: "bg-green-500", icon: CheckCircle },
  FULL_REFUND: { label: "Refunded", color: "bg-blue-500", icon: RefreshCw },
  PARTIAL_REFUND: { label: "Partially Refunded", color: "bg-blue-400", icon: RefreshCw },
  AMBIGUOUS: { label: "Payment Issue", color: "bg-orange-500", icon: AlertCircle },
  NOT_FOUND: { label: "Payment Expired", color: "bg-gray-500", icon: XCircle },
  CANCELED: { label: "Payment Cancelled", color: "bg-red-500", icon: XCircle },
  cod: { label: "Cash on Delivery", color: "bg-gray-600", icon: CreditCard },
};

const OrderTracking = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { fetchUserOrders, getOrderByNumber, getEsewaTransactionStatus, loading } = useOrders();
  const [trackingId, setTrackingId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState("");
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<Record<string, PaymentStatus>>({});
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchingOrder, setSearchingOrder] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserOrders();
    } else {
      setLoadingOrders(false);
    }
  }, [user]);

  const loadUserOrders = async () => {
    setLoadingOrders(true);
    const orders = await fetchUserOrders();
    setUserOrders(orders);
    
    // Fetch payment statuses for eSewa orders
    const esewaOrders = orders.filter(o => o.payment_method === 'esewa');
    const statuses: Record<string, PaymentStatus> = {};
    
    await Promise.all(esewaOrders.map(async (order) => {
      const status = await getEsewaTransactionStatus(order.id);
      if (status) {
        statuses[order.id] = status;
      }
    }));
    
    setPaymentStatuses(statuses);
    setLoadingOrders(false);
  };

  const handleSearch = async () => {
    if (!trackingId.trim()) {
      setSearchError("Please enter an order ID");
      return;
    }
    
    setSearchingOrder(true);
    setSearchError("");
    
    const order = await getOrderByNumber(trackingId.trim().toUpperCase());
    
    if (order) {
      setSearchedOrder(order);
      
      // Fetch payment status if eSewa
      if (order.payment_method === 'esewa') {
        const status = await getEsewaTransactionStatus(order.id);
        if (status) {
          setPaymentStatuses(prev => ({ ...prev, [order.id]: status }));
        }
      }
    } else {
      setSearchedOrder(null);
      setSearchError("Order not found. Please check the order ID and try again.");
    }
    
    setSearchingOrder(false);
  };

  const handleReorder = async (order: Order) => {
    let itemsAdded = 0;
    for (const item of order.items) {
      if (item.productId) {
        let product = products.find(p => p.id === item.productId);
        if (!product) {
          // Try to fetch from Supabase if not found in static data
          const { data, error } = await supabase.from('products').select('*').eq('id', item.productId).single();
          if (!error && data) {
            product = data;
          }
        }
        if (product) {
          addToCart(product, item.quantity);
          itemsAdded++;
        }
      }
    }
    if (itemsAdded > 0) {
      toast({
        title: "Items added to cart",
        description: `${itemsAdded} item(s) from your previous order have been added to your cart.`,
      });
    } else {
      toast({
        title: "No items added",
        description: `No products from this order are available to reorder.`,
        variant: "destructive",
      });
    }
  };

  const getPaymentStatusInfo = (order: Order) => {
    if (order.payment_method === 'cod') {
      return paymentStatusConfig.cod;
    }
    
    if (order.payment_method === 'esewa') {
      const esewaStatus = paymentStatuses[order.id];
      if (esewaStatus) {
        return paymentStatusConfig[esewaStatus.status as keyof typeof paymentStatusConfig] || paymentStatusConfig.PENDING;
      }
      return paymentStatusConfig.INITIATED;
    }
    
    return { label: order.payment_method, color: "bg-gray-500", icon: CreditCard };
  };

  const generateInvoicePDF = (order: Order) => {
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) {
      toast({
        title: "Popup blocked",
        description: "Please allow popups to download the invoice.",
        variant: "destructive",
      });
      return;
    }

    const statusInfo = statusConfig[order.status];
    const paymentInfo = getPaymentStatusInfo(order);

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.order_number}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
          .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 3px solid #2d5a27; padding-bottom: 20px; }
          .company-info h1 { color: #2d5a27; font-size: 28px; margin-bottom: 5px; }
          .company-info p { color: #666; font-size: 14px; }
          .invoice-meta { text-align: right; }
          .invoice-meta h2 { color: #2d5a27; font-size: 24px; margin-bottom: 10px; }
          .invoice-meta p { font-size: 14px; color: #666; margin-bottom: 5px; }
          .customer-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .customer-details div { flex: 1; }
          .customer-details h3 { color: #2d5a27; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; }
          .customer-details p { font-size: 14px; color: #333; margin-bottom: 5px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items-table th { background: #2d5a27; color: white; padding: 12px; text-align: left; font-size: 14px; }
          .items-table td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
          .items-table tr:nth-child(even) { background: #f9f9f9; }
          .total-section { text-align: right; margin-top: 20px; }
          .total-row { display: flex; justify-content: flex-end; margin-bottom: 8px; }
          .total-row span { width: 150px; }
          .total-row.grand-total { font-size: 18px; font-weight: bold; color: #2d5a27; border-top: 2px solid #2d5a27; padding-top: 10px; }
          .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
          .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-right: 10px; }
          .status-order { background: #dcfce7; color: #166534; }
          .status-payment { background: #dbeafe; color: #1e40af; }
          @media print { body { padding: 20px; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div class="company-info">
            <h1>KHAIRAWANG DAIRY</h1>
            <p>Farm Fresh Dairy Products</p>
            <p>123 Dairy Lane, Gurgaon, Haryana - 122001</p>
            <p>Phone: +977 9876543210 | Email: info@khairawangdairy.com</p>
            <p>GSTIN: 06ABCDE1234F1Z5</p>
          </div>
          <div class="invoice-meta">
            <h2>INVOICE</h2>
            <p><strong>Invoice No:</strong> INV-${order.order_number}</p>
            <p><strong>Order ID:</strong> ${order.order_number}</p>
            <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p style="margin-top: 10px;">
              <span class="status-badge status-order">${statusInfo.label}</span>
              <span class="status-badge status-payment">${paymentInfo.label}</span>
            </p>
          </div>
        </div>
        
        <div class="customer-details">
          <div>
            <h3>Bill To</h3>
            <p><strong>${order.customer_name}</strong></p>
            <p>${order.delivery_address}</p>
            <p>Phone: ${order.customer_phone || 'N/A'}</p>
            <p>Email: ${order.customer_email}</p>
          </div>
          <div>
            <h3>Payment Info</h3>
            <p><strong>Method:</strong> ${order.payment_method === 'esewa' ? 'eSewa' : order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}</p>
            <p><strong>Status:</strong> ${paymentInfo.label}</p>
            ${paymentStatuses[order.id]?.ref_id ? `<p><strong>Ref ID:</strong> ${paymentStatuses[order.id].ref_id}</p>` : ''}
          </div>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 50%">Item</th>
              <th style="text-align: center">Qty</th>
              <th style="text-align: right">Unit Price</th>
              <th style="text-align: right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td style="text-align: center">${item.quantity}</td>
                <td style="text-align: right">₹${item.price.toFixed(2)}</td>
                <td style="text-align: right">₹${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${order.subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Delivery:</span>
            <span>${order.shipping === 0 ? 'FREE' : `₹${order.shipping.toFixed(2)}`}</span>
          </div>
          ${order.tax > 0 ? `
          <div class="total-row">
            <span>Tax:</span>
            <span>₹${order.tax.toFixed(2)}</span>
          </div>
          ` : ''}
          <div class="total-row grand-total">
            <span>Grand Total:</span>
            <span>₹${order.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for shopping with Khairawang Dairy!</p>
          <p style="margin-top: 5px;">For any queries, please contact us at support@khairawangdairy.com</p>
          <button onclick="window.print()" class="no-print" style="margin-top: 20px; padding: 10px 30px; background: #2d5a27; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
            Print / Download PDF
          </button>
        </div>
      </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
  };

  const PaymentStatusBadge = ({ order }: { order: Order }) => {
    const paymentInfo = getPaymentStatusInfo(order);
    const PaymentIcon = paymentInfo.icon;
    
    return (
      <Badge className={`${paymentInfo.color} text-white gap-1`}>
        {order.payment_method === 'esewa' && <Wallet className="w-3 h-3" />}
        {order.payment_method === 'cod' && <CreditCard className="w-3 h-3" />}
        {paymentInfo.label}
      </Badge>
    );
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const StatusIcon = statusConfig[order.status].icon;
    const paymentInfo = getPaymentStatusInfo(order);
    
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold">{order.order_number}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ordered on {new Date(order.created_at).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={`${statusConfig[order.status].color} text-white`}>
                <StatusIcon className="w-3.5 h-3.5 mr-1" />
                {statusConfig[order.status].label}
              </Badge>
              <PaymentStatusBadge order={order} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Payment Status Section */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Payment Method</p>
                <p className="font-medium flex items-center gap-1">
                  {order.payment_method === 'esewa' && <Wallet className="w-4 h-4 text-green-600" />}
                  {order.payment_method === 'esewa' ? 'eSewa' : order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Status</p>
                <p className="font-medium">{paymentInfo.label}</p>
              </div>
              {order.payment_method === 'esewa' && paymentStatuses[order.id] && (
                <>
                  {paymentStatuses[order.id].ref_id && (
                    <div>
                      <p className="text-muted-foreground">Reference ID</p>
                      <p className="font-medium font-mono text-xs">{paymentStatuses[order.id].ref_id}</p>
                    </div>
                  )}
                  {paymentStatuses[order.id].verified_at && (
                    <div>
                      <p className="text-muted-foreground">Verified At</p>
                      <p className="font-medium text-xs">
                        {new Date(paymentStatuses[order.id].verified_at!).toLocaleString('en-IN')}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Delivery Address</p>
                <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Order Items</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
                </div>
                <div className="flex justify-between font-semibold mt-2">
                  <span>Total</span>
                  <span className="text-primary">₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewingOrder(order)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateInvoicePDF(order)}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download Invoice
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleReorder(order)}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reorder
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Track Your Order
              </h1>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary mb-2">
                Order Status & History
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Enter your order ID to see real-time delivery and payment status
              </p>

              {/* Search Box */}
              <div className="flex gap-2 max-w-md mx-auto">
                <Input
                  placeholder="Enter Order ID (e.g., KD20241212-1234)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} className="gap-2" disabled={searchingOrder}>
                  {searchingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Track
                </Button>
              </div>

              {searchError && (
                <p className="text-destructive text-sm mt-4">{searchError}</p>
              )}
            </div>
          </div>
        </section>

        {/* Search Result */}
        {searchedOrder && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <OrderCard order={searchedOrder} />
              </div>
            </div>
          </section>
        )}

        {/* User's Orders */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {user ? (
                <>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Your Recent Orders
                  </h2>
                  {loadingOrders ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : userOrders.length > 0 ? (
                    <div className="space-y-6">
                      {userOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        No orders yet
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Start shopping to see your orders here
                      </p>
                      <Button asChild>
                        <Link to="/products" title="Browse All Products">Browse Products</Link>
                      </Button>
                    </Card>
                  )}
                </>
              ) : (
                <Card className="p-8 text-center">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Sign in to view your orders
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Create an account or sign in to see your order history and track deliveries
                  </p>
                  <Button asChild>
                    <Link to="/auth" title="Sign In to Your Account">Sign In</Link>
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Order Details Dialog */}
        <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Order Details - {viewingOrder?.order_number}
              </DialogTitle>
            </DialogHeader>
            
            {viewingOrder && (
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Status</p>
                    <p className="font-semibold">{statusConfig[viewingOrder.status].label}</p>
                  </div>
                  <Badge className={`${statusConfig[viewingOrder.status].color} text-white`}>
                    {statusConfig[viewingOrder.status].label}
                  </Badge>
                </div>

                {/* Payment Status */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Payment Method</p>
                      <p className="font-medium flex items-center gap-1">
                        {viewingOrder.payment_method === 'esewa' && <Wallet className="w-4 h-4 text-green-600" />}
                        {viewingOrder.payment_method === 'esewa' ? 'eSewa' : viewingOrder.payment_method === 'cod' ? 'Cash on Delivery' : viewingOrder.payment_method}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Status</p>
                      <PaymentStatusBadge order={viewingOrder} />
                    </div>
                    {viewingOrder.payment_method === 'esewa' && paymentStatuses[viewingOrder.id] && (
                      <>
                        {paymentStatuses[viewingOrder.id].ref_id && (
                          <div className="col-span-2">
                            <p className="text-muted-foreground">Reference ID</p>
                            <p className="font-medium font-mono">{paymentStatuses[viewingOrder.id].ref_id}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Name</p>
                    <p className="font-medium">{viewingOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{viewingOrder.customer_phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{viewingOrder.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">
                      {new Date(viewingOrder.created_at).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Delivery Address</p>
                      <p className="text-sm text-muted-foreground">{viewingOrder.delivery_address}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Order Items</h4>
                  <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                    {viewingOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-3 mt-3 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{viewingOrder.subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery</span>
                        <span>{viewingOrder.shipping === 0 ? 'Free' : `₹${viewingOrder.shipping}`}</span>
                      </div>
                      <div className="flex justify-between font-semibold mt-2">
                        <span>Total</span>
                        <span className="text-primary">₹{viewingOrder.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => generateInvoicePDF(viewingOrder)}
                    className="gap-2 flex-1"
                  >
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </Button>
                  <Button
                    onClick={() => {
                      handleReorder(viewingOrder);
                      setViewingOrder(null);
                    }}
                    className="gap-2 flex-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reorder
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default OrderTracking;