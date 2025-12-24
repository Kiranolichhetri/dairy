import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function FeaturedProducts() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').eq('featured', true);
      if (!error) setFeaturedProducts(data || []);
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Handpicked favorites from our collection, loved by thousands of customers 
              for their exceptional quality and taste.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/products')} className="shrink-0">
            View All Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-4 text-center text-muted-foreground">Loading...</div>
          ) : featuredProducts.length === 0 ? (
            <div className="col-span-4 text-center text-muted-foreground">No featured products found.</div>
          ) : (
            featuredProducts.slice(0, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
