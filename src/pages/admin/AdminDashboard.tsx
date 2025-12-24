import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Plus,
  Milk,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';

type Tab = 'overview' | 'products' | 'orders';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Dynamic stats state
  const [stats, setStats] = useState([
    { label: 'Total Products', value: '...', icon: Package, color: 'bg-primary/10 text-primary' },
    { label: 'Total Orders', value: '...', icon: ShoppingCart, color: 'bg-accent/10 text-accent' },
    { label: 'Customers', value: '...', icon: Users, color: 'bg-fresh-green/10 text-fresh-green' },
    { label: 'Revenue', value: '...', icon: TrendingUp, color: 'bg-butter/10 text-butter' },
  ]);

  useEffect(() => {
    let subscription: any;
    async function fetchStats() {
      // Products count
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Orders count and revenue
      const { count: orderCount, data: ordersData } = await supabase
        .from('orders')
        .select('total', { count: 'exact' });
      const revenue = ordersData ? ordersData.reduce((sum, o) => sum + (o.total || 0), 0) : 0;

      // Customers count
      const { count: customerCount, error: customerError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      console.log('Customer count:', customerCount, 'Error:', customerError);

      setStats([
        { label: 'Total Products', value: productCount ?? 0, icon: Package, color: 'bg-primary/10 text-primary' },
        { label: 'Total Orders', value: orderCount ?? 0, icon: ShoppingCart, color: 'bg-accent/10 text-accent' },
        { label: 'Customers', value: customerCount ?? 0, icon: Users, color: 'bg-fresh-green/10 text-fresh-green' },
        { label: 'Revenue', value: `₹${(revenue/100000 >= 1) ? (revenue/100000).toFixed(2) + 'L' : revenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-butter/10 text-butter' },
      ]);
    }
    fetchStats();
    // Subscribe to real-time changes in profiles table
    subscription = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, fetchStats)
      .subscribe();
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-fresh-green-light flex items-center justify-center">
                  <Milk className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-sm">KHAIRAWANG</h1>
                  <p className="text-xs text-muted-foreground">Admin Panel</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab(item.id as Tab);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.displayName || 'Admin'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@example.com'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate('/')}>
                View Store
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="font-display text-xl font-bold capitalize">{activeTab}</h1>
            </div>
            {activeTab === 'products' && (
              <Button variant="hero" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-xl border border-border p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display font-semibold text-lg mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {[
                    { action: 'New order placed', time: '2 minutes ago', type: 'order' },
                    { action: 'Product stock updated', time: '1 hour ago', type: 'product' },
                    { action: 'New customer registered', time: '3 hours ago', type: 'user' },
                    { action: 'Order delivered', time: '5 hours ago', type: 'order' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders />}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
