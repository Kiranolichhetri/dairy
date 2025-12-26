import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group bg-card rounded-xl border border-border overflow-hidden hover-lift"
    >
      <Link to={`/products/${product.slug}`} className="block relative" title={`View details for ${product.name}`}> 
        <div className="aspect-square overflow-hidden bg-cream">
          <img
            src={product.image}
            alt={product.name}
            title={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <Badge className="bg-accent text-accent-foreground">Featured</Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive">{discount}% OFF</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Add ${product.name} to wishlist`}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <Heart className="w-4 h-4" />
        </Button>
      </Link>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="text-sm font-medium">{product.rating || 4.5}</span>
          <span className="text-xs text-muted-foreground">
            ({product.reviews || 0} reviews)
          </span>
        </div>

        <Link to={`/products/${product.slug}`} title={`View details for ${product.name}`}> 
          <h3 className="font-display font-semibold text-foreground mb-1 line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-3">{product.unit}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <Button
            variant="hero"
            size="sm"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>

        {product.stock < 10 && product.stock > 0 && (
          <p className="text-xs text-destructive mt-2">Only {product.stock} left!</p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-muted-foreground mt-2">Out of stock</p>
        )}
      </div>
    </motion.div>
  );
}
