import { useState, useMemo } from 'react';
// import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { categories } from '@/data/products';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useParams, useNavigate } from 'react-router-dom';

const Products = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (!error) setProducts(data || []);
      setLoading(false);
    };
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      const { data, error } = await supabase.from('categories').select('*');
      if (!error) setCategories(data || []);
      setCategoriesLoading(false);
    };
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          (p.description || '').toLowerCase().includes(searchLower)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, search, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      navigate('/products');
    } else {
      navigate(`/products/category/${category}`);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters = search || selectedCategory !== 'all' || sortBy !== 'featured';

  return (
    <Layout>
      <div className="bg-cream min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-background to-accent/10 py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Our Products
              </h1>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary mb-2">
                Discover the Best Dairy Selection
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our complete range of farm-fresh dairy products, 
                crafted with care from the finest ingredients.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort & Filter Toggle */}
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={showFilters ? 'secondary' : 'outline'}
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside
              className={`${
                showFilters ? 'block' : 'hidden'
              } lg:block w-full lg:w-64 shrink-0`}
            >
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h3 className="font-display font-semibold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => handleCategoryChange('all')}
                  >
                    All Products
                    <Badge variant="secondary" className="ml-auto">
                      {products.length}
                    </Badge>
                  </Button>
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat.slug).length;
                    return (
                      <Button
                        key={cat.id}
                        variant={selectedCategory === cat.slug ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => handleCategoryChange(cat.slug)}
                      >
                        {cat.name}
                        <Badge variant="secondary" className="ml-auto">
                          {count}
                        </Badge>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <p className="text-muted-foreground text-lg mb-4">Loading products...</p>
                </motion.div>
              ) : filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-muted-foreground text-lg mb-4">
                    No products found matching your criteria.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </motion.div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
