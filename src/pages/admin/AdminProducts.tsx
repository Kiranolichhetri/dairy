import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Eye, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';
export function AdminProducts() {
      // Categories state
      const [categories, setCategories] = useState<any[]>([]);
      const [categoriesLoading, setCategoriesLoading] = useState(true);

      useEffect(() => {
        const fetchCategories = async () => {
          setCategoriesLoading(true);
          const { data, error } = await supabase.from('categories').select('*');
          if (!error) setCategories(data || []);
          setCategoriesLoading(false);
        };
        fetchCategories();
      }, []);
    // State for Add Product dialog and form
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [addForm, setAddForm] = useState({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      stock: '',
      unit: '',
    });
    const [adding, setAdding] = useState(false);

    const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {

      setAddForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddCategoryChange = (value: string) => {
      setAddForm((prev) => ({ ...prev, category: value }));
    };

    const handleAddProduct = async () => {
      setAdding(true);
      const now = new Date().toISOString();
      const { error, data } = await supabase.from('products').insert([
        {
          name: addForm.name,
          description: addForm.description || 'No description',
          price: Number(addForm.price),
          category: addForm.category || 'uncategorized',
          image: addForm.image || 'https://via.placeholder.com/150',
          stock: Number(addForm.stock),
          unit: addForm.unit || 'unit',
          createdAt: now,
          updatedAt: now,
        },
      ]).select();
      setAdding(false);
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        setProductList((prev) => data ? [...prev, ...data] : prev);
        setAddDialogOpen(false);
        setAddForm({ name: '', price: '', stock: '' });
        toast({ title: 'Product added', description: 'The product has been created.' });
      }
    };
  const [search, setSearch] = useState('');
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', stock: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        setProductList(data || []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = productList.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setProductList((prev) => prev.filter((p) => p.id !== id));
      toast({
        title: "Product deleted",
        description: "The product has been removed successfully.",
      });
    }
  };

  const handleEditClick = (product: any) => {
    setEditProduct(product);
    setEditForm({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async () => {
    const { error } = await supabase.from('products').update({
      name: editForm.name,
      price: Number(editForm.price),
      stock: Number(editForm.stock),
    }).eq('id', editProduct.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editProduct.id
            ? { ...p, name: editForm.name, price: Number(editForm.price), stock: Number(editForm.stock) }
            : p
        )
      );
      setEditProduct(null);
      toast({
        title: "Product updated",
        description: "The product details have been updated.",
      });
    }
  };



  function handleEditCancel() {
    setEditProduct(null);
  }

  return (
    <>
      {/* Add Product Button */}
      <div className="flex justify-end mb-4">
        <Button onClick={() => setAddDialogOpen(true)}>Add Product</Button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading && <div className="text-center py-8">Loading products...</div>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.unit}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="capitalize">
                  {(product.category || '').replace('-', ' ')}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">₹{product.price}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        ₹{product.originalPrice}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  {product.stock > 10 ? (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      In Stock
                    </Badge>
                  ) : product.stock > 0 ? (
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      Low Stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(product)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            No products found matching your search.
          </div>
        )}
      </div>

      {/* Edit Product Dialog */}
      </motion.div>
      {/* Add Product Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label="Name"
              name="name"
              value={addForm.name}
              onChange={handleAddChange}
              placeholder="Product Name"
            />
            <Input
              label="Description"
              name="description"
              value={addForm.description}
              onChange={handleAddChange}
              placeholder="Description"
            />
            <Input
              label="Price"
              name="price"
              type="number"
              value={addForm.price}
              onChange={handleAddChange}
              placeholder="Price"
            />
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select value={addForm.category} onValueChange={handleAddCategoryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={categoriesLoading ? 'Loading...' : 'Select a category'} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              label="Image URL"
              name="image"
              value={addForm.image}
              onChange={handleAddChange}
              placeholder="Image URL"
            />
            <Input
              label="Stock"
              name="stock"
              type="number"
              value={addForm.stock}
              onChange={handleAddChange}
              placeholder="Stock"
            />
            <Input
              label="Unit"
              name="unit"
              value={addForm.unit}
              onChange={handleAddChange}
              placeholder="Unit (e.g. L, kg, pcs)"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddProduct} disabled={adding}>
              {adding ? 'Adding...' : 'Add'}
            </Button>
            <Button variant="secondary" onClick={() => setAddDialogOpen(false)} disabled={adding}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!editProduct} onOpenChange={setEditProduct}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label="Name"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              placeholder="Product Name"
            />
            <Input
              label="Price"
              name="price"
              type="number"
              value={editForm.price}
              onChange={handleEditChange}
              placeholder="Price"
            />
            <Input
              label="Stock"
              name="stock"
              type="number"
              value={editForm.stock}
              onChange={handleEditChange}
              placeholder="Stock"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleEditSave}>Save</Button>
            <Button variant="secondary" onClick={handleEditCancel}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
